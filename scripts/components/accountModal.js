import { openAccountFormModal } from './accountFormModal.js';
import { getTranslation } from '../i18n.js';

export async function openAccountModal(accountsWithBalances) {
  const db = window.db;
  if (!db) {
    window.showCustomAlert('database_not_available', 'error');
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = 'account-list-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';

  const renderAccountList = (accounts) => {
    return accounts.map(acc => {
      const colors = window.getTailwindColorClasses(acc.color);
      return `
        <div class="flex items-center justify-between p-3 rounded-lg ${colors.bg} active:scale-102 hover:scale-102 transition cursor-pointer" data-account-id="${acc.id}">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 ${colors.colorDot} rounded"></div>
            <span class="text-sm font-medium">${acc.name}</span>
          </div>
          <span class="text-sm font-medium">${window.formatCurrency(acc.balance)}</span>
        </div>
      `;
    }).join('');
  };

  wrapper.innerHTML = `
    <div class="bg-white w-80 max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center text-gray-800">${getTranslation('accounts')}</h2>

      <div class="space-y-2" id="modal-account-list-container">
        ${renderAccountList(accountsWithBalances)}
      </div>

      <div class="flex flex-col items-center gap-2 pt-2">
        <button id="add-new-account-btn" class="w-full px-6 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 active:bg-blue-600 cursor-pointer">
          ${getTranslation('add_new_account')}
        </button>
        <button id="close-account-modal-btn" class="w-full px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
          ${getTranslation('close')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modalContainer = wrapper.querySelector('#modal-account-list-container');
  const addAccountBtn = wrapper.querySelector('#add-new-account-btn');
  const closeBtn = wrapper.querySelector('#close-account-modal-btn');

  const refreshAccountListInModal = async () => {
    const updatedAccounts = await window.calculateAccountBalances();
    modalContainer.innerHTML = renderAccountList(updatedAccounts);
    attachAccountItemListeners();
  };

  const attachAccountItemListeners = () => {
    const accountItems = modalContainer.querySelectorAll('[data-account-id]');
    accountItems.forEach(item => {
      item.addEventListener('click', async () => {
        const accountId = item.dataset.accountId;
        const accountToEdit = await db.accounts.get(Number(accountId));

        if (accountToEdit) {
          wrapper.classList.add('hidden');
          openAccountFormModal(accountToEdit, async () => {
            await refreshAccountListInModal();
            wrapper.classList.remove('hidden');
            window.renderAccounts();
            window.renderTotalBalance();
          }, async () => {
            await refreshAccountListInModal();
            wrapper.classList.remove('hidden');
            window.renderAccounts();
            window.renderTotalBalance();
          }, () => {
            wrapper.classList.remove('hidden');
          });
        }
      });
    });
  };

  attachAccountItemListeners();

  addAccountBtn.addEventListener('click', () => {
    wrapper.classList.add('hidden');
    openAccountFormModal(null, async () => {
      await refreshAccountListInModal();
      wrapper.classList.remove('hidden');
      window.renderAccounts();
      window.renderTotalBalance();
    }, null, () => {
      wrapper.classList.remove('hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    wrapper.remove();
  });
}