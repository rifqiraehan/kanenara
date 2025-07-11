import { openConfirmDeleteModal } from '../components/confirmModal.js';
import { getTranslation } from '../i18n.js';

export async function openTransactionModal(accountsWithBalances = [], transactionToEdit = null) {
  const db = window.db;
  if (!db) {
    window.showCustomAlert('database_not_available', 'error');
    return;
  }

  const accounts = accountsWithBalances.length > 0 ? accountsWithBalances : await window.calculateAccountBalances();

  const isEditMode = transactionToEdit !== null;
  const modalTitle = isEditMode ? getTranslation('edit_transaction') : getTranslation('add_transaction');

  let state = {
    type: isEditMode ? transactionToEdit.type : 'expense',
    date: isEditMode ? new Date(transactionToEdit.date) : new Date(),
    fromAccountId: isEditMode ? transactionToEdit.accountId : undefined,
    toAccountId: isEditMode ? transactionToEdit.toAccountId : undefined,
    amount: isEditMode ? transactionToEdit.amount : 0,
    note: isEditMode ? transactionToEdit.description : ''
  };

  const year = state.date.getFullYear();
  const month = (state.date.getMonth() + 1).toString().padStart(2, '0');
  const day = state.date.getDate().toString().padStart(2, '0');
  const hours = state.date.getHours().toString().padStart(2, '0');
  const minutes = state.date.getMinutes().toString().padStart(2, '0');
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  const wrapper = document.createElement('div');
  wrapper.id = 'transaction-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';

  const getAccountBalanceDisplay = (accountId) => {
    const account = accounts.find(a => Number(a.id) === Number(accountId));
    return account ? window.formatCurrency(account.balance) : window.formatCurrency(0);
  };

  const createBalanceDisplayHtml = (formattedBalanceString) => `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5 mr-2"
    >
      <path
        fill-rule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clip-rule="evenodd"
      ></path>
    </svg>
    Total ${getTranslation('balance_label')} ${formattedBalanceString}
  `;

  const fontSizeClass = window.currentLanguage === 'en' ? 'text-lg' : 'text-md';

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center">${modalTitle}</h2>
      <div class="flex justify-center gap-4">
        ${['income', 'expense', 'transfer'].map(type => `
          <button data-tab="${type}" class="tab-btn ${fontSizeClass} font-medium ${type === state.type ? 'bg-gray-200 rounded-full px-3' : ''} cursor-pointer">
            ${getTranslation(type)}
          </button>
        `).join('')}
      </div>

      <div>
        <label class="text-sm font-medium">${getTranslation('date_and_time')}</label>
        <input type="datetime-local" value="${formattedDateTime}" class="w-full mt-1 px-3 py-2 border rounded text-sm" id="input-date" />
      </div>

      <div>
        <label class="text-sm font-medium">${getTranslation('from_account')}</label>
        <select id="from-account" class="w-full mt-1 px-3 py-2 border rounded text-sm">
          ${accounts.map(a => `<option value="${a.id}" ${Number(a.id) === Number(state.fromAccountId) ? 'selected' : ''}>${a.name}</option>`).join('')}
        </select>
        <p id="from-account-balance-display" class="flex items-center mt-2 text-xs text-slate-500">
        </p>
      </div>

      <div id="to-account-section" class="${state.type === 'transfer' ? '' : 'hidden'}">
        <label class="text-sm font-medium">${getTranslation('to_account')}</label>
        <select id="to-account" class="w-full mt-1 px-3 py-2 border rounded text-sm">
          ${accounts.map(a => `<option value="${a.id}" ${Number(a.id) === Number(state.toAccountId) ? 'selected' : ''}>${a.name}</option>`).join('')}
        </select>
        <p id="to-account-balance-display" class="flex items-center mt-2 text-xs text-slate-500">
        </p>
      </div>

      <div class="w-full max-w-md mx-auto">
        <div class="mb-4">
          <div class="relative">
            <span class="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-800 ml-3" id="currency-symbol-input">Rp</span>
            <input
              type="number"
              id="input-amount"
              class="w-full text-center text-4xl font-semibold text-gray-800 py- focus:outline-none focus:border-blue-500 pl-16 pr-3"
              placeholder="0"
              aria-label="Amount"
              value="${state.amount || ''}" >
          </div>
        </div>

        <div class="mb-4">
          <hr class="w-full my-0" />
          <input
            type="text"
            id="input-note"
            class="w-full text-center text-lg text-gray-700 py-2 focus:outline-none placeholder-gray-500"
            placeholder="${getTranslation('add_description_placeholder')}"
            aria-label="Description"
            value="${state.note || ''}" >
        </div>
      </div>

      <div class="flex justify-center gap-4">
        ${isEditMode ? `
          <button id="btn-remove" class="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">${getTranslation('remove')}</button>
        ` : ''}
        <button id="btn-save" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 active:bg-green-600 cursor-pointer">${getTranslation('save')}</button>
        <button id="btn-cancel" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">${getTranslation('cancel')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modal = wrapper.querySelector('.relative');
  const tabButtons = modal.querySelectorAll('[data-tab]');
  const fromAccountSelect = modal.querySelector('#from-account');
  const toAccountSelect = modal.querySelector('#to-account');
  const fromAccountBalanceDisplay = modal.querySelector('#from-account-balance-display');
  const toAccountBalanceDisplay = modal.querySelector('#to-account-balance-display');
  const currencySymbolInput = modal.querySelector('#currency-symbol-input');

  const toSection = modal.querySelector('#to-account-section');

  const updateBalanceDisplays = () => {
    const selectedFromAccountId = fromAccountSelect.value;
    const selectedToAccountId = toAccountSelect?.value;

    fromAccountBalanceDisplay.innerHTML = createBalanceDisplayHtml(getAccountBalanceDisplay(selectedFromAccountId));

    if (toAccountBalanceDisplay && state.type === 'transfer') {
      toAccountBalanceDisplay.innerHTML = createBalanceDisplayHtml(getAccountBalanceDisplay(selectedToAccountId));
    } else if (toAccountBalanceDisplay) {
      toAccountBalanceDisplay.innerHTML = createBalanceDisplayHtml(window.formatCurrency(0));
    }
  };

  const updateInputCurrencySymbol = () => {
    const symbol = window.currentCurrencySetting === 1 ? '$' : 'Rp';
    if (currencySymbolInput) {
      currencySymbolInput.textContent = symbol;
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.type = btn.dataset.tab;
      tabButtons.forEach(button => {
        button.classList.remove('bg-gray-200', 'rounded-full', 'px-3');
      });
      btn.classList.add('bg-gray-200', 'rounded-full', 'px-3');

      if (state.type === 'transfer') {
        toSection.classList.remove('hidden');
      } else {
        toSection.classList.add('hidden');
      }
      updateBalanceDisplays();
    });
  });

  fromAccountSelect.addEventListener('change', updateBalanceDisplays);
  if (toAccountSelect) {
    toAccountSelect.addEventListener('change', updateBalanceDisplays);
  }

  updateBalanceDisplays();
  updateInputCurrencySymbol();

  modal.querySelector('#btn-save')?.addEventListener('click', async () => {
    const amount = parseFloat(modal.querySelector('#input-amount').value);
    const note = modal.querySelector('#input-note').value.trim();
    const fromId = fromAccountSelect.value;
    const toId = toAccountSelect?.value || null;
    const inputDateTimeString = modal.querySelector('#input-date').value;
    const baseDate = new Date(inputDateTimeString);
    const now = new Date();

    baseDate.setSeconds(now.getSeconds());
    baseDate.setMilliseconds(now.getMilliseconds());

    const finalDateTimeForStorage = baseDate.toISOString();

    if (isNaN(amount) || amount <= 0) {
      window.showCustomAlert('invalid_amount_warning', 'warning');
      return;
    }

    const transactionData = {
      type: state.type,
      date: finalDateTimeForStorage,
      description: note,
      amount,
      accountId: fromId,
      toAccountId: state.type === 'transfer' ? toId : null
    };

    if (isEditMode) {
      transactionData.id = transactionToEdit.id;
      await db.transactions.put(transactionData);
      window.showCustomAlert('transaction_updated_success', 'success');
    } else {
      await db.transactions.add(transactionData);
      window.showCustomAlert('transaction_added_success', 'success');
    }

    window.dispatchEvent(new CustomEvent('dataChanged'));

    wrapper.remove();
  });

  if (isEditMode) {
    modal.querySelector('#btn-remove')?.addEventListener('click', async () => {
      wrapper.classList.add('hidden');

      openConfirmDeleteModal(
        getTranslation('confirm_delete_transaction_message'),
        async () => {
          try {
            await db.transactions.delete(transactionToEdit.id);
            window.showCustomAlert('transaction_deleted_success', 'success');

            window.dispatchEvent(new CustomEvent('dataChanged'));
            wrapper.remove();
          } catch (error) {
            console.error("Error deleting transaction:", error);
            window.showCustomAlert('failed_to_delete_transaction', 'error');
            wrapper.classList.remove('hidden');
          }
        },
        () => {
          wrapper.classList.remove('hidden');
        }
      );
    });
  }

  modal.querySelector('#btn-cancel')?.addEventListener('click', () => {
    wrapper.remove();
  });

  if (state.type !== 'transfer') {
    toSection.classList.add('hidden');
  }
  modal.querySelector(`[data-tab="${state.type}"]`)?.classList.add('bg-gray-200', 'rounded-full', 'px-3');

  updateBalanceDisplays();
  updateInputCurrencySymbol();
}