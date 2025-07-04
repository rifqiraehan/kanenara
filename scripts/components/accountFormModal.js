import { openConfirmDeleteModal } from './confirmModal.js';

export async function openAccountFormModal(accountToEdit = null, onSaveCallback = null, onDeleteCallback = null, onCancelCallback = null) {
  const db = window.db;
  if (!db) {
    window.showCustomAlert('Database tidak tersedia.', 'error');
    if (onCancelCallback) onCancelCallback();
    return;
  }

  const isEditMode = accountToEdit !== null;
  const modalTitle = isEditMode ? 'Edit Account' : 'Add Account';

  let balanceToDisplay = 0;
  if (isEditMode && accountToEdit) {
    const balances = await window.calculateAccountBalances();
    const found = balances.find(acc => acc.id === accountToEdit.id);
    if (found) {
      balanceToDisplay = found.balance;
    }
  }

  let state = {
    name: isEditMode ? accountToEdit.name : '',
    initialBalance: balanceToDisplay,
    color: isEditMode ? accountToEdit.color : 'gray'
  };

  const colorPalette = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
    'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink'
  ];

  const wrapper = document.createElement('div');
  wrapper.id = 'account-form-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-1000';

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center">${modalTitle}</h2>

      <div>
        <label class="text-sm font-medium">Account Name:</label>
        <input type="text" id="account-name-input" class="w-full mt-1 px-3 py-2 border rounded text-sm" placeholder="e.g., Bank Account" value="${state.name}" />
      </div>

      <div>
        <label class="text-sm font-medium">Balance:</label>
        <div class="relative">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800 ml-3" id="currency-symbol-input">${window.currentCurrencySetting === 1 ? '$' : 'Rp'}</span>
          <input type="number" id="initial-balance-input" class="w-full text-center text-xl font-semibold text-gray-800 py- focus:outline-none focus:border-blue-500 pl-16 pr-3" value="${state.initialBalance}" />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium mb-2 block">Color:</label>
        <div id="color-palette" class="flex flex-wrap gap-2 justify-center">
          ${colorPalette.map(color => {
    const colorClass = `bg-${color}-500`;
    return `
              <button type="button" class="w-8 h-8 rounded-full ${colorClass} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform hover:scale-110" data-color="${color}" aria-label="Select ${color} color"></button>
            `;
  }).join('')}
        </div>
      </div>

      <div class="flex justify-center gap-4 pt-2">
        ${isEditMode ? `
          <button id="btn-remove-account" class="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">Remove</button>
        ` : ''}
        <button id="btn-save-account" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 active:bg-green-600 cursor-pointer">Save</button>
        <button id="btn-cancel-account" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modal = wrapper.querySelector('.relative');
  const colorPaletteContainer = modal.querySelector('#color-palette');
  const accountNameInput = modal.querySelector('#account-name-input');
  const initialBalanceInput = modal.querySelector('#initial-balance-input');
  const currencySymbolInput = modal.querySelector('#currency-symbol-input');
  const saveBtn = modal.querySelector('#btn-save-account');
  const cancelBtn = modal.querySelector('#btn-cancel-account');
  const removeBtn = modal.querySelector('#btn-remove-account');

  currencySymbolInput.textContent = window.currentCurrencySetting === 1 ? '$' : 'Rp';

  const initialColorButton = colorPaletteContainer.querySelector(`button[data-color="${state.color}"]`);
  if (initialColorButton) {
    initialColorButton.classList.add('border-2', 'border-blue-500');
  }
  initialBalanceInput.value = state.initialBalance;

  colorPaletteContainer.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button[data-color]');
    if (clickedButton) {
      modal.querySelectorAll('.border-blue-500').forEach(btn => btn.classList.remove('border-2', 'border-blue-500'));
      clickedButton.classList.add('border-2', 'border-blue-500');
      state.color = clickedButton.dataset.color;
    }
  });

  async function createBalanceAdjustmentTransaction(accountId, delta) {
    if (delta === 0) return;

    await db.transactions.add({
      type: delta > 0 ? 'income' : 'expense',
      amount: Math.abs(delta),
      accountId,
      description: 'Update Balance',
      date: new Date()
    });
  }

  saveBtn.addEventListener('click', async () => {
    const name = accountNameInput.value.trim();
    const newBalance = parseFloat(initialBalanceInput.value);

    if (!name) {
      window.showCustomAlert('Nama akun tidak boleh kosong.', 'warning');
      return;
    }
    if (isNaN(newBalance)) {
      window.showCustomAlert('Saldo tidak valid.', 'warning');
      return;
    }

    try {
      if (isEditMode) {
        const balances = await window.calculateAccountBalances();
        const oldAccount = balances.find(acc => acc.id === accountToEdit.id);
        const oldBalance = oldAccount ? oldAccount.balance : 0;
        const delta = newBalance - oldBalance;

        const updatedAccount = {
          ...accountToEdit,
          name,
          color: state.color
        };

        await db.accounts.put(updatedAccount);

        if (delta !== 0) {
          await createBalanceAdjustmentTransaction(accountToEdit.id, delta);
        }

        window.showCustomAlert('Akun berhasil diperbarui!', 'success');
      } else {
        await db.accounts.add({
          name,
          color: state.color,
          initialBalance: newBalance
        });
        window.showCustomAlert('Akun berhasil ditambahkan!', 'success');
      }

      const event = new CustomEvent('accountDataChanged', {
        detail: {
          accountId: isEditMode ? accountToEdit.id : null,
          changeType: isEditMode ? 'edit' : 'create'
        }
      });
      window.dispatchEvent(event);

      wrapper.remove();

      if (onSaveCallback) {
        await onSaveCallback();
      }
    } catch (error) {
      console.error("Error saving account:", error);
      window.showCustomAlert('Gagal menyimpan akun.', 'error');
    }
  });

  cancelBtn.addEventListener('click', () => {
    wrapper.remove();
    if (onCancelCallback) onCancelCallback();
  });

  if (isEditMode && removeBtn) {
    removeBtn.addEventListener('click', () => {
      wrapper.classList.add('hidden');

      openConfirmDeleteModal(
        `Apakah Anda yakin ingin menghapus akun "${accountToEdit.name}"? Tindakan ini juga akan menghapus semua transaksi yang terkait.`,
        async () => {
          try {
            await db.accounts.delete(accountToEdit.id);
            await db.transactions.where('accountId').equals(accountToEdit.id).delete();
            await db.transactions.where('toAccountId').equals(accountToEdit.id).delete();

            const event = new CustomEvent('accountDataChanged', {
              detail: {
                accountId: accountToEdit.id,
                changeType: 'delete'
              }
            });
            window.dispatchEvent(event);

            window.showCustomAlert('Akun berhasil dihapus!', 'success');
            wrapper.remove();
            if (onDeleteCallback) await onDeleteCallback();
          } catch (error) {
            console.error("Error deleting account:", error);
            window.showCustomAlert('Gagal menghapus akun.', 'error');
            wrapper.classList.remove('hidden');
          }
        },
        () => {
          wrapper.classList.remove('hidden');
          window.showCustomAlert('Penghapusan akun dibatalkan.', 'info', 1500);
        }
      );
    });
  }
}
