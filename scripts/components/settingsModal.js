import { openConfirmConversionModal } from './confirmConversionModal.js';

export async function openSettingsModal() {
  const db = window.db;
  if (!db) {
    window.showCustomAlert('Database tidak tersedia.', 'error');
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = 'settings-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';

  const currentCurrency = window.currentCurrencySetting;

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center text-gray-800">Settings</h2>

      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-3 text-center">Main Currency</h3>
        <div class="flex justify-center gap-3">
          <button id="currency-usd-btn"
                  class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentCurrency === 1 ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
            US Dollar
          </button>
          <button id="currency-idr-btn"
                  class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentCurrency === 0 ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
            Indonesia Rupiah
          </button>
        </div>
      </div>
      <div id="exchange-rate-display" class="text-center text-sm text-gray-500 mt-2">
        <i class="fas fa-info-circle"></i> Mengambil nilai tukar terkini...
      </div>


      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-3 text-center">Data Option</h3>
        <div class="flex justify-center gap-3">
          <button id="export-data-btn"
                  class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
            Export
          </button>
          <input type="file" id="import-file-input" accept=".json" class="hidden" />
          <button id="import-data-btn"
                  class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
            Import
          </button>
        </div>
      </div>

      <div class="flex justify-center gap-4 pt-2">
        <button id="save-settings-btn" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 active:bg-green-600 cursor-pointer">Save</button>
        <button id="cancel-settings-btn" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modal = wrapper.querySelector('.relative');
  const currencyUsdBtn = modal.querySelector('#currency-usd-btn');
  const currencyIdrBtn = modal.querySelector('#currency-idr-btn');
  const exportDataBtn = modal.querySelector('#export-data-btn');
  const importDataBtn = modal.querySelector('#import-data-btn');
  const importFileInput = modal.querySelector('#import-file-input');
  const saveSettingsBtn = modal.querySelector('#save-settings-btn');
  const cancelSettingsBtn = modal.querySelector('#cancel-settings-btn');

  let selectedCurrency = currentCurrency;

  currencyUsdBtn.addEventListener('click', () => {
    selectedCurrency = 1;

    currencyUsdBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-gray-300 text-gray-800 border border-transparent cursor-pointer';
    currencyIdrBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 cursor-pointer';
  });

  currencyIdrBtn.addEventListener('click', () => {
    selectedCurrency = 0;

    currencyIdrBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-gray-300 text-gray-800 border border-transparent cursor-pointer';
    currencyUsdBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 cursor-pointer';
  });


  const exchangeRateEl = modal.querySelector('#exchange-rate-display');
  if (exchangeRateEl) {
    try {
      const rate = await window.fetchExchangeRateUSDToIDR();
      exchangeRateEl.innerHTML = `<i class="fas fa-info-circle"></i> 1 USD = IDR ${rate.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch (error) {
      exchangeRateEl.innerHTML = `<i class="fas fa-info-circle"></i> 1 USD = IDR 16.000,00`;
    }
  }

  exportDataBtn.addEventListener('click', async () => {
    try {
      const allAccounts = await db.accounts.toArray();
      const allTransactions = await db.transactions.toArray();
      const allSettings = await db.settings.toArray();

      const dataToExport = {
        accounts: allAccounts,
        transactions: allTransactions,
        settings: allSettings
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Kanenara_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      window.showCustomAlert('Data berhasil diekspor!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      window.showCustomAlert('Gagal mengekspor data.', 'error');
    }
  });

  importDataBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
      window.showCustomAlert('Tidak ada file yang dipilih.', 'warning');
      return;
    }

    if (file.type !== 'application/json') {
      window.showCustomAlert('Hanya file JSON yang diizinkan.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!importedData.accounts || !Array.isArray(importedData.accounts) ||
          !importedData.transactions || !Array.isArray(importedData.transactions) ||
          !importedData.settings || !Array.isArray(importedData.settings)) {
          window.showCustomAlert('Struktur file JSON tidak valid.', 'error');
          return;
        }

        await db.transaction('rw', db.accounts, db.transactions, db.settings, async (tx) => {
          await tx.accounts.clear();
          await tx.transactions.clear();
          await tx.settings.clear();

          await tx.accounts.bulkAdd(importedData.accounts);
          await tx.transactions.bulkAdd(importedData.transactions);
          await tx.settings.bulkAdd(importedData.settings);
        });

        window.showCustomAlert('Data berhasil diimpor dan diperbarui!', 'success');
        window.dispatchEvent(new CustomEvent('dataChanged'));
        wrapper.remove();
      } catch (parseError) {
        console.error('Error parsing or importing data:', parseError);
        window.showCustomAlert('Gagal membaca atau mengimpor file data.', 'error');
      }
    };
    reader.readAsText(file);
  });

  saveSettingsBtn.addEventListener('click', async () => {
    if (selectedCurrency === window.currentCurrencySetting) {
      wrapper.remove();
      return;
    }

    wrapper.classList.add('hidden');

    const message = `Apakah Anda yakin ingin mengubah mata uang utama menjadi ${selectedCurrency === 1 ? 'US Dollar' : 'Indonesia Rupiah'}? Perubahan ini akan secara permanen mengubah semua nominal yang tercatat di seluruh transaksi Anda.`;

    openConfirmConversionModal(
      message,
      async () => {
        try {
          await window.convertCurrencyInDatabase(selectedCurrency);
          await db.settings.put({ key: 'main-currency', value: selectedCurrency });
          window.currentCurrencySetting = selectedCurrency;

          window.dispatchEvent(new CustomEvent('dataChanged'));

          window.showCustomAlert('Pengaturan mata uang berhasil disimpan dan data dikonversi!', 'success');
          wrapper.remove();
        } catch (error) {
          console.error('Error saving settings or converting currency:', error);
          window.showCustomAlert('Gagal menyimpan pengaturan atau mengonversi mata uang.', 'error');
          wrapper.classList.remove('hidden');
        }
      },
      () => {
        wrapper.classList.remove('hidden');
      }
    );
  });

  cancelSettingsBtn.addEventListener('click', () => {
    wrapper.remove();
  });
}