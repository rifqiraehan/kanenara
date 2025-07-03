import { openTransactionModal } from './components/transactionForm.js';

document.addEventListener('DOMContentLoaded', async () => {
  const addTransactionBtn = document.querySelector('[data-action="add-transaction"]');

  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', async () => {
      const accountsWithBalances = await calculateAccountBalances();
      openTransactionModal(accountsWithBalances);
    });
  }

  if (!window.db) {
    console.error('IndexedDB tidak terdeteksi. Pastikan Dexie CDN dimuat.');
  }

  await renderAccounts();
  renderTransactions();
  renderTotalBalance();
});

function getTailwindColorClasses(baseColor) {
  const safeColor = baseColor || 'gray';
  return {
    bg: `bg-${safeColor}-100`,
    colorDot: `bg-${safeColor}-400`,
    text: `text-${safeColor}-800`
  };
}

async function calculateAccountBalances() {
  const accounts = await db.accounts.toArray();
  const transactions = await db.transactions.toArray();

  const accountBalances = accounts.map(account => {
    const balance = transactions.reduce((sum, trx) => {
      if (trx.accountId === account.id) {
        if (trx.type === 'expense' || trx.type === 'transfer') {
          return sum - trx.amount;
        } else if (trx.type === 'income') {
          return sum + trx.amount;
        }
      }
      if (trx.toAccountId === account.id && trx.type === 'transfer') {
        return sum + trx.amount;
      }
      return sum;
    }, account.initialBalance);

    return { ...account, balance };
  });
  return accountBalances;
}

async function renderAccounts() {
  const accountBalances = await calculateAccountBalances();

  const container = document.getElementById('account-list');
  container.innerHTML = '';

  for (const acc of accountBalances) {
    const colors = getTailwindColorClasses(acc.color);
    const el = document.createElement('div');

    el.className = `flex items-center justify-between p-3 rounded-lg ${colors.bg} active:scale-102 hover:scale-102 transition cursor-pointer`;
    el.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 ${colors.colorDot} rounded"></div>
        <span class="text-sm">${acc.name}</span>
      </div>
      <span class="text-sm font-medium">Rp ${acc.balance.toLocaleString()}</span>
    `;
    container.appendChild(el);
  }
}

async function renderTransactions() {
  const db = window.db;
  if (!db) {
    console.error('Database is not available for transactions.');
    return;
  }

  let transactions = await db.transactions.toArray();
  const accounts = await db.accounts.toArray();
  const accountMap = Object.fromEntries(accounts.map(a => [a.id, a]));

  const container = document.getElementById('transaction-list');
  container.innerHTML = '';
  transactions.sort((a, b) => b.id - a.id);
  const groups = new Map();

  for (const trx of transactions) {
    const date = new Date(trx.date);
    const displayDateKey = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const groupSortDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    if (!groups.has(displayDateKey)) {
      groups.set(displayDateKey, {
        sortValue: groupSortDate,
        transactions: []
      });
    }
    groups.get(displayDateKey).transactions.push(trx);
  }

  const sortedGroupKeys = Array.from(groups.keys()).sort((keyA, keyB) => {
    const groupA = groups.get(keyA);
    const groupB = groups.get(keyB);
    return groupB.sortValue - groupA.sortValue;
  });

  for (const dateStr of sortedGroupKeys) {
    const groupData = groups.get(dateStr);
    const trxList = groupData.transactions;

    const section = document.createElement('div');
    section.className = 'space-y-1';

    let total = 0;
    for (const trx of trxList) {
      if (trx.type !== 'transfer') {
        total += trx.type === 'expense' ? -trx.amount : trx.amount;
      }
    }

    const totalText = `Σ ${total < 0 ? '-' : '+'} Rp ${Math.abs(total).toLocaleString('id-ID')}`;
    const totalClass = total < 0 ? 'text-red-600' : 'text-green-600';

    const groupHeader = `
      <div class="flex items-center justify-between border-b border-gray-300 pb-1">
        <span class="text-sm font-medium text-gray-700">${dateStr}</span>
        <span class="text-sm font-semibold ${totalClass}">${totalText}</span>
      </div>
    `;

    const trxHtml = trxList.map(trx => {
      const acc = accountMap[trx.accountId];
      const toAcc = trx.toAccountId ? accountMap[trx.toAccountId] : null;
      const time = new Date(trx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const amount = `Rp ${trx.amount.toLocaleString('id-ID')}`;
      const amountClass = trx.type === 'expense' ? 'text-red-600' : 'text-green-600';

      let labelHtml;

      if (trx.type === 'transfer') {
        const fromAccountName = acc?.name || 'Unknown';
        const toAccountName = toAcc?.name || 'Unknown';

        // Dynamic color class generation for transfer labels
        const fromColors = getTailwindColorClasses(acc?.color);
        const toColors = getTailwindColorClasses(toAcc?.color);

        labelHtml = `
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs">
            <span class="${fromColors.bg} ${fromColors.text} px-2 py-0.5 rounded">${fromAccountName}</span>
            <i class="fa-solid fa-arrow-right text-gray-500 mx-1"></i>
            <span class="${toColors.bg} ${toColors.text} px-2 py-0.5 rounded">${toAccountName}</span>
          </div>
        `;
      } else {
        const singleAccountName = acc?.name || 'Unknown';
        const singleAccountColors = getTailwindColorClasses(acc?.color);
        labelHtml = `<div class="inline-flex items-center px-2 py-0.5 ${singleAccountColors.bg} ${singleAccountColors.text} text-xs rounded">${singleAccountName}</div>`;
      }

      return `
        <div class="py-1 rounded-lg hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150 cursor-pointer">
          <div class="flex justify-between items-start px-0 transition-transform duration-150 hover:scale-[0.96] active:scale-[0.96]">
            <div class="space-y-1">
              <p class="text-sm font-medium text-gray-800">${trx.description}</p>
              ${labelHtml}
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold ${amountClass}">${amount}</p>
              <p class="text-xs text-gray-500">${time}</p>
            </div>
          </div>
        </div>`;
    }).join('');

    section.innerHTML = groupHeader + trxHtml;
    container.appendChild(section);
  }
}

async function renderTotalBalance() {
  const accountsWithCalculatedBalances = await calculateAccountBalances();
  const totalBalance = accountsWithCalculatedBalances.reduce((sum, account) => {
    return sum + account.balance;
  }, 0);

  const el = document.querySelector('section.text-center p.text-3xl');
  el.textContent = `Rp ${totalBalance.toLocaleString('id-ID')},00`;
}

window.renderTransactions = renderTransactions;
window.renderAccounts = renderAccounts;
window.renderTotalBalance = renderTotalBalance;
window.calculateAccountBalances = calculateAccountBalances;