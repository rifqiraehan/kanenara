import { openConfirmConversionModal } from './confirmConversionModal.js';
import { openConfirmImportModal } from './confirmImportModal.js';
import { openConfirmResetModal } from './confirmResetModal.js';
import { getTranslation } from '../i18n.js';

export async function openSettingsModal() {
  const wrapper = document.createElement('div');
  wrapper.id = 'settings-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';

  const currentCurrency = window.currentCurrencySetting;
  const currentLang = window.currentLanguage;

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center text-gray-800">${getTranslation('settings')}</h2>

      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-3 text-center">${getTranslation('main_currency')}</h3>
        <div class="flex justify-center gap-3">
          <button id="currency-usd-btn"
                  class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentCurrency === 1 ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
            ${getTranslation('us_dollar')}
          </button>
          <button id="currency-idr-btn"
                  class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentCurrency === 0 ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
            ${getTranslation('indonesia_rupiah')}
          </button>
        </div>
      </div>
      <div id="exchange-rate-display" class="text-center text-sm text-gray-500 mt-2">
        <i class="fas fa-info-circle"></i> ${getTranslation('fetching_exchange_rate')}
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-3 text-center">${getTranslation('app_language')}</h3>
        <div class="flex justify-center gap-3">
            <button id="lang-en-btn"
                    class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentLang === 'en' ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
              English
            </button>
            <button id="lang-id-btn"
                    class="px-5 py-2 rounded-lg text-sm font-medium transition border ${currentLang === 'id' ? 'bg-gray-300 text-gray-800 border-transparent' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'} cursor-pointer">
              Indonesia
            </button>
        </div>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-3 text-center">${getTranslation('data_option')}</h3>
        <div class="flex justify-center gap-3">
          <button id="export-data-btn"
                  class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
            ${getTranslation('export')}
          </button>
          <input type="file" id="import-file-input" accept=".json" class="hidden" />
          <button id="import-data-btn"
                  class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
            ${getTranslation('import')}
          </button>
          <button id="reset-data-btn"
                  class="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 active:bg-gray-100 cursor-pointer">
            ${getTranslation('reset')}
          </button>
        </div>
      </div>

      <div class="flex justify-center gap-4 pt-2">
        <button id="save-settings-btn" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 active:bg-green-600 cursor-pointer">${getTranslation('save')}</button>
        <button id="cancel-settings-btn" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">${getTranslation('cancel')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modal = wrapper.querySelector('.relative');
  const currencyUsdBtn = modal.querySelector('#currency-usd-btn');
  const currencyIdrBtn = modal.querySelector('#currency-idr-btn');
  const langEnBtn = modal.querySelector('#lang-en-btn');
  const langIdBtn = modal.querySelector('#lang-id-btn');
  const exportDataBtn = modal.querySelector('#export-data-btn');
  const importDataBtn = modal.querySelector('#import-data-btn');
  const importFileInput = modal.querySelector('#import-file-input');
  const resetDataBtn = modal.querySelector('#reset-data-btn');
  const saveSettingsBtn = modal.querySelector('#save-settings-btn');
  const cancelSettingsBtn = modal.querySelector('#cancel-settings-btn');

  let selectedCurrency = currentCurrency;
  let selectedLanguage = currentLang;

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

  langEnBtn.addEventListener('click', () => {
    selectedLanguage = 'en';
    langEnBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-gray-300 text-gray-800 border border-transparent cursor-pointer';
    langIdBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 cursor-pointer';
  });

  langIdBtn.addEventListener('click', () => {
    selectedLanguage = 'id';
    langIdBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-gray-300 text-gray-800 border border-transparent cursor-pointer';
    langEnBtn.className = 'px-5 py-2 rounded-lg text-sm font-medium transition bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 cursor-pointer';
  });

  const exchangeRateEl = modal.querySelector('#exchange-rate-display');
  if (exchangeRateEl) {
    try {
      const rate = await window.fetchExchangeRateUSDToIDR();
      exchangeRateEl.innerHTML = `<i class="fas fa-info-circle"></i> 1 USD = IDR ${rate.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch (error) {
      exchangeRateEl.innerHTML = `<i class="fas fa-info-circle"></i> ${getTranslation('default_exchange_rate_info')}`;
    }
  }

  exportDataBtn.addEventListener('click', async () => {
    try {
      const allAccounts = await db.accounts.toArray();
      const rawTransactions = await db.transactions.toArray();
      const allTransactions = rawTransactions.map(trx => ({
        ...trx,
        accountId: trx.accountId !== undefined ? Number(trx.accountId) : undefined,
        toAccountId: trx.toAccountId !== undefined ? Number(trx.toAccountId) : undefined
      }));
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

      // window.showCustomAlert('data_exported_success', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      window.showCustomAlert('failed_to_export_data', 'error');
    }
  });

  importDataBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) {
      window.showCustomAlert('import_file_not_selected', 'warning');
      return;
    }

    if (file.type !== 'application/json') {
      window.showCustomAlert('invalid_json_file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (
          !importedData.accounts || !Array.isArray(importedData.accounts) ||
          !importedData.transactions || !Array.isArray(importedData.transactions) ||
          !importedData.settings || !Array.isArray(importedData.settings)
        ) {
          window.showCustomAlert('invalid_json_structure', 'error');
          return;
        }

        openConfirmImportModal(
          async () => {
            await db.transaction('rw', db.accounts, db.transactions, db.settings, async (tx) => {
              await tx.accounts.clear();
              await tx.transactions.clear();
              await tx.settings.clear();

              await tx.accounts.bulkAdd(importedData.accounts);
              await tx.transactions.bulkAdd(importedData.transactions);
              await tx.settings.bulkAdd(importedData.settings);
            });

            // window.showCustomAlert('data_imported_success', 'success');

            wrapper.remove();
            location.reload();
          },
          () => {
            importFileInput.value = '';
          }
        );

      } catch (parseError) {
        console.error('Error parsing or importing data:', parseError);
        window.showCustomAlert('failed_to_read_import_file', 'error');
      }
    };

    reader.readAsText(file);
  });

  resetDataBtn.addEventListener('click', () => {
    wrapper.classList.add('hidden');

    openConfirmResetModal(
      async () => {
        try {
          const resetSuccess = await window.performFullReset();

          if (resetSuccess) {
            // window.showCustomAlert('reset_success', 'success');
            wrapper.remove();
            location.reload();
          } else {
            window.showCustomAlert('failed_to_reset', 'error');
            wrapper.classList.remove('hidden');
          }
        } catch (error) {
          console.error('Error initiating full database reset:', error);
          window.showCustomAlert('failed_to_reset', 'error');
          wrapper.classList.remove('hidden');
        }
      },
      () => {
        wrapper.classList.remove('hidden');
      }
    );
  });

  saveSettingsBtn.addEventListener('click', async () => {
    let shouldReload = false;

    if (selectedCurrency !== window.currentCurrencySetting) {

      wrapper.classList.add('hidden');

      const newCurrencyName = selectedCurrency === 1 ? getTranslation('us_dollar') : getTranslation('indonesia_rupiah');
      const message = getTranslation('conversion_confirm_question', { newCurrency: newCurrencyName });

      openConfirmConversionModal(
        message,
        async () => {
          try {
            await window.convertCurrencyInDatabase(selectedCurrency);
            await db.settings.put({ key: 'main-currency', value: selectedCurrency });
            window.currentCurrencySetting = selectedCurrency;
            // window.showCustomAlert('currency_settings_saved_converted', 'success');
            shouldReload = true;

            if (selectedLanguage !== window.currentLanguage) {
              await db.settings.put({ key: 'app-language', value: selectedLanguage });
              window.currentLanguage = selectedLanguage;

            }

            wrapper.remove();
            if (shouldReload) {
              location.reload();
            } else {
              window.dispatchEvent(new CustomEvent('dataChanged'));
            }

          } catch (error) {
            console.error('Error saving settings or converting currency:', error);
            window.showCustomAlert('failed_to_save_currency_settings', 'error');
            wrapper.classList.remove('hidden');
          }
        },
        () => {
          wrapper.classList.remove('hidden');
        }
      );
    } else {

      if (selectedLanguage !== window.currentLanguage) {
        try {
          await db.settings.put({ key: 'app-language', value: selectedLanguage });
          window.currentLanguage = selectedLanguage;
          shouldReload = true;
          // window.showCustomAlert('settings_saved', 'success');
        } catch (error) {
          console.error('Error saving language setting:', error);
          window.showCustomAlert('failed_to_save_settings', 'error');
        }
      }

      wrapper.remove();
      if (shouldReload) {
        location.reload();
      } else {

      }
    }
  });

  cancelSettingsBtn.addEventListener('click', () => {
    wrapper.remove();
  });
}