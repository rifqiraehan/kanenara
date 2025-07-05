import { openTransactionModal } from './components/transactionForm.js';
import { openAccountModal } from './components/accountModal.js';
import { openAccountFormModal } from './components/accountFormModal.js';
import { openSettingsModal } from './components/settingsModal.js';
import { renderIncomeExpenseChart } from './components/graph.js';
import { createPaginationControls } from './components/pagination.js';

let currentCurrencySetting = 0;
let currentTransactionPage = 1;
const TRANSACTIONS_PER_PAGE = 10;

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
  const accountBtn = document.querySelector('[data-action="account-menu"]');
  const settingsBtn = document.querySelector('[data-action="settings-menu"]');

  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', async () => {
      const accountsWithBalances = await calculateAccountBalances();
      openTransactionModal(accountsWithBalances);
    });
  }

  if (accountBtn) {
    accountBtn.addEventListener('click', async () => {
      const accountsWithBalances = await calculateAccountBalances();
      openAccountModal(accountsWithBalances);
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      openSettingsModal();
    });
  }

  if (!window.db) {
    console.error('IndexedDB tidak terdeteksi. Pastikan Dexie CDN dimuat.');
  }

  renderTransactions();
  renderTotalBalance();
  await fetchCurrencySetting();
  await renderAccounts();
  await renderIncomeExpenseChart();
});

async function fetchCurrencySetting() {
  const setting = await db.settings.get('main-currency');
  if (setting !== undefined) {
    currentCurrencySetting = setting.value;
    window.currentCurrencySetting = currentCurrencySetting;
  }
}

function formatCurrency(amount) {
  const locale = 'id-ID';
  const isUSD = window.currentCurrencySetting === 1;
  const symbol = isUSD ? '$ ' : 'Rp ';
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

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
      if (Number(trx.accountId) === Number(account.id)) {
        if (trx.type === 'expense' || trx.type === 'transfer') {
          return sum - trx.amount;
        } else if (trx.type === 'income') {
          return sum + trx.amount;
        }
      }
      if (Number(trx.toAccountId) === Number(account.id) && trx.type === 'transfer') {
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
    el.dataset.accountId = acc.id;
    el.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 ${colors.colorDot} rounded"></div>
        <span class="text-sm">${acc.name}</span>
      </div>
      <span class="text-sm font-medium">${formatCurrency(acc.balance)}</span>
    `;

    el.addEventListener('click', async () => {
      const accountToEdit = await db.accounts.get(Number(acc.id));
      if (accountToEdit) {
        openAccountFormModal(accountToEdit);
      } else {
        window.showCustomAlert('Akun tidak ditemukan.', 'error');
      }
    });

    container.appendChild(el);
  }
}

async function renderTransactions() {
  const db = window.db;
  if (!db) return;

  const allTransactions = await db.transactions.toArray();
  allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  const accounts = await db.accounts.toArray();
  const accountMap = Object.fromEntries(accounts.map(a => [a.id, a]));

  const container = document.getElementById('transaction-list');
  container.innerHTML = '';

  const totalPages = Math.ceil(allTransactions.length / TRANSACTIONS_PER_PAGE);
  const startIdx = (currentTransactionPage - 1) * TRANSACTIONS_PER_PAGE;
  const endIdx = startIdx + TRANSACTIONS_PER_PAGE;
  const transactions = allTransactions.slice(startIdx, endIdx);

  const fullDailyTotals = {};
  for (const trx of allTransactions) {
    const dateKey = new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!fullDailyTotals[dateKey]) fullDailyTotals[dateKey] = 0;
    if (trx.type === 'income') fullDailyTotals[dateKey] += trx.amount;
    else if (trx.type === 'expense') fullDailyTotals[dateKey] -= trx.amount;
  }

  const groups = new Map();
  for (const trx of transactions) {
    const date = new Date(trx.date);
    const dateKey = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const groupSortKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    if (!groups.has(dateKey)) {
      groups.set(dateKey, { sortValue: groupSortKey, transactions: [] });
    }
    groups.get(dateKey).transactions.push(trx);
  }

  const sortedDates = [...groups.entries()].sort((a, b) => b[1].sortValue - a[1].sortValue);

  for (const [dateStr, group] of sortedDates) {
    const section = document.createElement('div');
    section.className = 'space-y-1 mt-2';

    const total = fullDailyTotals[dateStr] || 0;
    const totalFormatted = `Σ ${total < 0 ? '-' : '+'} ${formatCurrency(Math.abs(total))}`;
    const totalClass = total < 0 ? 'text-red-600' : 'text-green-600';

    const groupHeader = `
      <div class="flex items-center justify-between border-b border-gray-300 pb-1">
        <span class="text-sm font-medium text-gray-700">${dateStr}</span>
        <span class="text-sm font-semibold ${totalClass}">${totalFormatted}</span>
      </div>`;

    const trxHtml = group.transactions.map(trx => {
      const acc = accountMap[trx.accountId];
      const toAcc = trx.toAccountId ? accountMap[trx.toAccountId] : null;
      const time = new Date(trx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const amount = formatCurrency(trx.amount);
      const amountClass = trx.type === 'expense' ? 'text-red-600' : 'text-green-600';

      const labelHtml = trx.type === 'transfer'
        ? `<div class="inline-flex items-center gap-1 text-xs">
            <span class="${getTailwindColorClasses(acc?.color).bg} ${getTailwindColorClasses(acc?.color).text} px-2 py-0.5 rounded">${acc?.name}</span>
            <i class="fa-solid fa-arrow-right text-gray-500"></i>
            <span class="${getTailwindColorClasses(toAcc?.color).bg} ${getTailwindColorClasses(toAcc?.color).text} px-2 py-0.5 rounded">${toAcc?.name}</span>
          </div>`
        : `<div class="inline-flex items-center text-xs px-2 py-0.5 ${getTailwindColorClasses(acc?.color).bg} ${getTailwindColorClasses(acc?.color).text} rounded">${acc?.name}</div>`;

      return `
        <div class="py-1 rounded-lg hover:bg-gray-100 active:bg-gray-100 transition cursor-pointer" data-transaction-id="${trx.id}">
          <div class="flex justify-between items-start">
            <div>
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

  container.querySelectorAll('[data-transaction-id]').forEach(item => {
    item.addEventListener('click', async () => {
      const trxId = parseInt(item.dataset.transactionId);
      const trx = await db.transactions.get(trxId);
      const balances = await calculateAccountBalances();
      if (trx) openTransactionModal(balances, trx);
      else window.showCustomAlert('Transaksi tidak ditemukan.', 'error');
    });
  });

  const paginationSection = document.getElementById('pagination-controls');
  paginationSection.innerHTML = '';
  if (totalPages > 1) {
    const controls = createPaginationControls({
      currentPage: currentTransactionPage,
      totalPages,
      onPageChange: (newPage) => {
        currentTransactionPage = newPage;
        renderTransactions();
      }
    });
    paginationSection.appendChild(controls);
  }
}

async function renderTotalBalance() {
  const accountsWithCalculatedBalances = await calculateAccountBalances();
  const totalBalance = accountsWithCalculatedBalances.reduce((sum, account) => {
    return sum + account.balance;
  }, 0);

  const el = document.querySelector('section.text-center p.text-3xl');
  el.textContent = formatCurrency(totalBalance);
}

async function fetchExchangeRateUSDToIDR() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data && data.result === 'success') {
      const rate = data.rates?.IDR;
      if (rate) {
        console.log(`Fetched USD → IDR exchange rate: ${rate}`);
        return rate;
      }
    }
    throw new Error('Exchange rate data invalid');
  } catch (err) {
    console.error('Failed to fetch exchange rate:', err);
    window.showCustomAlert('Gagal mengambil nilai tukar USD ↔ IDR. Gunakan nilai default 16000.', 'warning');

    return 16000;
  }
}

async function convertCurrencyInDatabase(newCurrencySetting) {
  const db = window.db;
  const oldSetting = window.currentCurrencySetting;
  if (oldSetting === newCurrencySetting) return;

  const liveRate = await fetchExchangeRateUSDToIDR();
  let multiplier;
  if (oldSetting === 0 && newCurrencySetting === 1) {
    multiplier = 1 / liveRate;
  } else if (oldSetting === 1 && newCurrencySetting === 0) {
    multiplier = liveRate;
  } else {
    console.warn("Unexpected currency conversion setting.");
    return;
  }

  await db.transaction('rw', db.accounts, db.transactions, db.settings, async (tx) => {
    const accounts = await tx.accounts.toArray();
    const updatedAccounts = accounts.map(acc => ({
      ...acc,
      initialBalance: parseFloat((acc.initialBalance * multiplier).toFixed(2))
    }));
    await tx.accounts.bulkPut(updatedAccounts);

    const transactions = await tx.transactions.toArray();
    const updatedTransactions = transactions.map(trx => ({
      ...trx,
      amount: parseFloat((trx.amount * multiplier).toFixed(2))
    }));
    await tx.transactions.bulkPut(updatedTransactions);

    await tx.settings.put({ key: 'main-currency', value: newCurrencySetting });
    window.currentCurrencySetting = newCurrencySetting;
  });
}

window.addEventListener('dataChanged', async () => {
  await window.fetchCurrencySetting();
  await window.renderAccounts();
  await window.renderTotalBalance();
  await window.renderTransactions();
  await renderIncomeExpenseChart();
});

window.renderTransactions = renderTransactions;
window.renderAccounts = renderAccounts;
window.renderTotalBalance = renderTotalBalance;
window.calculateAccountBalances = calculateAccountBalances;
window.fetchCurrencySetting = fetchCurrencySetting;
window.formatCurrency = formatCurrency;
window.getTailwindColorClasses = getTailwindColorClasses;
window.convertCurrencyInDatabase = convertCurrencyInDatabase;
window.fetchExchangeRateUSDToIDR = fetchExchangeRateUSDToIDR;