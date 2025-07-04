import { openTransactionModal } from './components/transactionForm.js';

let currentCurrencySetting = 0;

function showCustomAlert(message, type = 'success', duration = 3000) {
  let iconHtml = '';
  let borderColorClass = '';
  let textColorClass = '';

  switch (type) {
    case 'success':
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>`;
      borderColorClass = 'border-green-300';
      textColorClass = 'text-green-900';
      break;
    case 'error':
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>`;
      borderColorClass = 'border-red-300';
      textColorClass = 'text-red-900';
      break;
    case 'warning':
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-yellow-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.293 2.093 3.293h13.174c1.788 0 2.959-1.793 2.093-3.293L12.96 2.47c-.865-1.5-3.377-1.5-4.242 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>`;
      borderColorClass = 'border-yellow-300';
      textColorClass = 'text-yellow-900';
      break;
    default:
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063 0l.041.02a.75.75 0 01-.063 1.063l-.041.02a.75.75 0 01-1.063 0l-.041-.02a.75.75 0 01.063-1.063zM12 7.5h.008v.008H12V7.5z" />
                  </svg>`;
      borderColorClass = 'border-gray-300';
      textColorClass = 'text-gray-900';
  }

  const outerWrapper = document.createElement('div');
  outerWrapper.className = `fixed top-5 left-0 right-0 z-[1000] transition-all duration-300 ease-out opacity-0 translate-y-[-20px]`;
  outerWrapper.role = 'alert';
  const alertContent = document.createElement('div');
  alertContent.className = `rounded-md ${borderColorClass} bg-white p-4 shadow-lg max-w-xl mx-auto`;

  alertContent.innerHTML = `
    <div class="flex items-start gap-4">
      ${iconHtml}
      <div class="flex-1">
        <strong class="font-medium ${textColorClass}">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <p class="mt-0.5 text-sm text-gray-700">${message}</p>
      </div>
      <button class="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700" type="button" aria-label="Dismiss alert">
        <span class="sr-only">Dismiss popup</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  outerWrapper.appendChild(alertContent);
  document.body.appendChild(outerWrapper);

  setTimeout(() => {
    outerWrapper.style.opacity = '1';
    outerWrapper.style.transform = 'translateY(0)';
  }, 10);

  const dismissButton = alertContent.querySelector('button[aria-label="Dismiss alert"]');
  const dismissAlert = () => {
    outerWrapper.style.opacity = '0';
    outerWrapper.style.transform = 'translateY(-20px)';
    outerWrapper.addEventListener('transitionend', () => {
      outerWrapper.remove();
    }, { once: true });
  };

  dismissButton.addEventListener('click', dismissAlert);

  if (duration > 0) {
    setTimeout(dismissAlert, duration);
  }
}


window.showCustomAlert = showCustomAlert;

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

  await fetchCurrencySetting();
  await renderAccounts();
  renderTransactions();
  renderTotalBalance();
});

async function fetchCurrencySetting() {
  const setting = await db.settings.get('main-currency');
  if (setting !== undefined) {
    currentCurrencySetting = setting.value;
  }
}

function formatCurrency(amount) {
  const locale = 'id-ID';
  let options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  let symbol = 'Rp ';

  if (currentCurrencySetting === 1) {
    symbol = '$ ';
    options.style = 'decimal';
    options.minimumFractionDigits = 2;
    options.maximumFractionDigits = 2;
  }

  const formatter = new Intl.NumberFormat(locale, options);
  return symbol + formatter.format(amount);
}

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
      <span class="text-sm font-medium">${formatCurrency(acc.balance)}</span>
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
    section.className = 'space-y-1 mt-2';

    let total = 0;
    for (const trx of trxList) {
      if (trx.type !== 'transfer') {
        total += trx.type === 'expense' ? -trx.amount : trx.amount;
      }
    }

    const totalText = `Σ ${total < 0 ? '-' : '+'} ${formatCurrency(total)}`;
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
      const amount = formatCurrency(trx.amount);
      const amountClass = trx.type === 'expense' ? 'text-red-600' : 'text-green-600';

      let labelHtml;

      if (trx.type === 'transfer') {
        const fromAccountName = acc?.name || 'Unknown';
        const toAccountName = toAcc?.name || 'Unknown';
        const fromColors = getTailwindColorClasses(acc?.color);
        const toColors = getTailwindColorClasses(toAcc?.color);

        labelHtml = `
          <div class="inline-flex items-center gap-1 py-0.5 rounded text-xs">
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
        <div class="py-1 rounded-lg hover:bg-gray-100 active:bg-gray-100 transition-colors duration-150 cursor-pointer" data-transaction-id="${trx.id}">
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

  const transactionItems = container.querySelectorAll('[data-transaction-id]');
  transactionItems.forEach(item => {
    item.addEventListener('click', async (event) => {
      const transactionId = parseInt(item.dataset.transactionId);
      const transactionToEdit = await db.transactions.get(transactionId);

      if (transactionToEdit) {
        const accountsWithBalances = await calculateAccountBalances();
        openTransactionModal(accountsWithBalances, transactionToEdit);
      } else {
        window.showCustomAlert('Transaksi tidak ditemukan.', 'error');
      }
    });
  });
}

async function renderTotalBalance() {
  const accountsWithCalculatedBalances = await calculateAccountBalances();
  const totalBalance = accountsWithCalculatedBalances.reduce((sum, account) => {
    return sum + account.balance;
  }, 0);

  const el = document.querySelector('section.text-center p.text-3xl');
  el.textContent = formatCurrency(totalBalance);
}

window.renderTransactions = renderTransactions;
window.renderAccounts = renderAccounts;
window.renderTotalBalance = renderTotalBalance;
window.calculateAccountBalances = calculateAccountBalances;
window.fetchCurrencySetting = fetchCurrencySetting;
window.formatCurrency = formatCurrency;