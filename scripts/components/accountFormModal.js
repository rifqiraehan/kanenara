import { openConfirmDeleteModal } from './confirmModal.js';
import { getTranslation } from '../i18n.js';

export async function openAccountFormModal(accountToEdit = null, onSaveCallback = null, onDeleteCallback = null, onCancelCallback = null) {
  const db = window.db;
  if (!db) {
    window.showCustomAlert('database_not_available', 'error');
    if (onCancelCallback) onCancelCallback();
    return;
  }

  const isEditMode = accountToEdit !== null;
  const modalTitle = isEditMode ? getTranslation('edit_account') : getTranslation('add_account');

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
  wrapper.className = 'fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-1000';

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center">${modalTitle}</h2>

      <div>
        <label class="text-sm font-medium">${getTranslation('account_name')}</label>
        <input type="text" id="account-name-input" class="w-full mt-1 px-3 py-2 border rounded text-sm" placeholder="${getTranslation('account_name_placeholder')}" value="${state.name}" />
      </div>

      <div>
        <label class="text-sm font-medium">${getTranslation('balance')}</label>
        <div class="relative">
          <span class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-500 ml-3" id="currency-symbol-input">${window.currentCurrencySetting === 1 ? '$' : 'Rp'}</span>
          <input type="number" id="initial-balance-input" class="w-full text-center text-xl font-semibold text-gray-500 py- focus:outline-none focus:border-gray-400 pl-16 pr-3" value="${state.initialBalance}" />
        </div>
      </div>

      <div>
        <label class="text-sm font-medium mb-2 block">${getTranslation('color')}</label>
        <div id="color-palette" class="flex flex-wrap gap-2 justify-center">
          ${colorPalette.map(color => {
    const colorClass = `bg-${color}-500`;
    return `
              <button type="button" class="w-8 h-8 rounded-full ${colorClass} focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-transform hover:scale-110" data-color="${color}" aria-label="${getTranslation('select_color', { color: color })}"></button>
            `;
  }).join('')}
        </div>
      </div>

      <div class="flex justify-center gap-4 pt-2">
        ${isEditMode ? `
          <button id="btn-remove-account" class="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">${getTranslation('remove')}</button>
        ` : ''}
        <button id="btn-save-account" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 active:bg-green-600 cursor-pointer">${getTranslation('save')}</button>
        <button id="btn-cancel-account" class="px-6 py-2 border border-gray-400 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">${getTranslation('cancel')}</button>
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
    initialColorButton.classList.add('border-3', 'border-gray-400');
  }
  initialBalanceInput.value = state.initialBalance;

  colorPaletteContainer.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button[data-color]');
    if (clickedButton) {
      modal.querySelectorAll('.border-gray-400').forEach(btn => btn.classList.remove('border-3', 'border-gray-400'));
      clickedButton.classList.add('border-3', 'border-gray-400');
      state.color = clickedButton.dataset.color;
    }
  });

  async function createBalanceAdjustmentTransaction(accountId, delta) {
    if (delta === 0) return;

    await db.transactions.add({
      type: delta > 0 ? 'income' : 'expense',
      amount: Math.abs(delta),
      accountId,
      description: getTranslation('update_balance'),
      date: new Date()
    });
  }

  saveBtn.addEventListener('click', async () => {
    const name = accountNameInput.value.trim();
    const newBalance = parseFloat(initialBalanceInput.value);

    if (!name) {
      window.showCustomAlert('account_name_empty_warning', 'warning');
      return;
    }
    if (isNaN(newBalance)) {
      window.showCustomAlert('invalid_balance_warning', 'warning');
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

        window.showCustomAlert('account_updated_success', 'success');
      } else {
        await db.accounts.add({
          name,
          color: state.color,
          initialBalance: newBalance
        });
        window.showCustomAlert('account_added_success', 'success');
      }

      const event = new CustomEvent('dataChanged', {
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
      window.showCustomAlert('failed_to_save_account', 'error');
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
        getTranslation('confirm_delete_account_message', { accountName: accountToEdit.name }),
        async () => {
          try {
            await db.accounts.delete(accountToEdit.id);
            await db.transactions.where('accountId').equals(accountToEdit.id).delete();
            await db.transactions.where('toAccountId').equals(accountToEdit.id).delete();

            const event = new CustomEvent('dataChanged', {
              detail: {
                accountId: accountToEdit.id,
                changeType: 'delete'
              }
            });
            window.dispatchEvent(event);

            window.showCustomAlert('account_deleted_success', 'success');
            wrapper.remove();
            if (onDeleteCallback) await onDeleteCallback();
          } catch (error) {
            console.error("Error deleting account:", error);
            window.showCustomAlert('failed_to_delete_account', 'error');
            wrapper.classList.remove('hidden');
          }
        },
        () => {
          wrapper.classList.remove('hidden');
          window.showCustomAlert('account_deletion_cancelled', 'info', 1500);
        }
      );
    });
  }
}