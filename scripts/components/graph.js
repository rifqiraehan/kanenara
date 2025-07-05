let chartInstance = null;
import { getTranslation } from '../i18n.js';

export async function renderIncomeExpenseChart() {
  const db = window.db;
  if (!db) return;

  const transactions = await db.transactions.toArray();
  const grouped = {};

  for (const trx of transactions) {
    const date = new Date(trx.date);
    const dateKey = date.toLocaleDateString(window.currentLanguage === 'id' ? 'id-ID' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (!grouped[dateKey]) {
      grouped[dateKey] = { income: 0, expense: 0 };
    }

    if (trx.type === 'income') grouped[dateKey].income += trx.amount;
    else if (trx.type === 'expense') grouped[dateKey].expense += trx.amount;
  }

  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const data = [];
  let runningBalance = 0;

  for (const label of labels) {
    const { income, expense } = grouped[label];
    runningBalance += income - expense;
    data.push({ x: label, y: runningBalance });
  }

  const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: getTranslation('balance_label'),
        data: data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.0,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: ctx => `${getTranslation('date_label')} ${ctx[0].label}`,
            label: ctx => `${getTranslation('balance_label')} ${formatCurrency(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          ticks: {
            callback: function(value) {
              return shortenNumber(value);
            }
          }
        }
      }
    }
  });
}

function shortenNumber(num) {
  if (window.currentLanguage === 'id') {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' M';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + ' Jt';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + ' rb';
  } else {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + ' B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + ' M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + ' K';
  }
  return num;
}

