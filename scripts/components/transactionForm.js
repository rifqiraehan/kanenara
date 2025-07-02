// scripts/components/transactionForm.js

export async function openTransactionModal() {
  const db = window.db;
  if (!db) {
    alert('Database tidak tersedia.');
    return;
  }

  const accounts = await db.accounts.toArray();
  let state = {
    type: 'expense',
    date: new Date(),
    fromAccountId: accounts[0]?.id,
    toAccountId: accounts[1]?.id || null,
    amount: 0,
    note: ''
  };

  const wrapper = document.createElement('div');
  wrapper.id = 'transaction-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';

  wrapper.innerHTML = `
    <div class="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative">
      <h2 class="text-xl font-semibold text-center">Add Transaction</h2>

      <div class="flex justify-center gap-4">
        ${['income', 'expense', 'transfer'].map(type => `
          <button data-tab="${type}" class="tab-btn text-sm font-medium">
            ${type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        `).join('')}
      </div>

      <div>
        <label class="text-sm font-medium">Date & Time:</label>
        <input type="datetime-local" value="${state.date.toISOString().slice(0,16)}" class="w-full mt-1 px-3 py-2 border rounded text-sm" id="input-date" />
      </div>

      <div>
        <label class="text-sm font-medium">From Account:</label>
        <select id="from-account" class="w-full mt-1 px-3 py-2 border rounded text-sm">
          ${accounts.map(a => `<option value="${a.id}" ${a.id === state.fromAccountId ? 'selected' : ''}>${a.name} | Rp ${a.initialBalance.toLocaleString()}</option>`).join('')}
        </select>
      </div>

      <div id="to-account-section">
        <label class="text-sm font-medium">To Account:</label>
        <select id="to-account" class="w-full mt-1 px-3 py-2 border rounded text-sm">
          ${accounts.map(a => `<option value="${a.id}" ${a.id === state.toAccountId ? 'selected' : ''}>${a.name} | Rp ${a.initialBalance.toLocaleString()}</option>`).join('')}
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Amount:</label>
        <input type="number" id="input-amount" class="w-full mt-1 px-3 py-2 border rounded text-sm" value="${state.amount}" />
      </div>

      <div>
        <label class="text-sm font-medium">Description:</label>
        <input type="text" id="input-note" class="w-full mt-1 px-3 py-2 border rounded text-sm" placeholder="Add note..." />
      </div>

      <div class="flex justify-center gap-4 pt-2">
        <button id="btn-save" class="px-6 py-2 bg-green-500 text-white rounded-lg text-sm">Save</button>
        <button id="btn-cancel" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const modal = wrapper.querySelector('.relative');
  const tabButtons = modal.querySelectorAll('[data-tab]');

  // Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.type = btn.dataset.tab;
      tabButtons.forEach(button => {
        button.classList.remove('bg-gray-200', 'rounded-full', 'px-3');
      });
      btn.classList.add('bg-gray-200', 'rounded-full', 'px-3');
    });
  });

  // Close modal
  modal.querySelector('#btn-cancel')?.addEventListener('click', () => wrapper.remove());

  // Save transaction
  modal.querySelector('#btn-save')?.addEventListener('click', async () => {
    const amount = parseFloat(modal.querySelector('#input-amount').value);
    const note = modal.querySelector('#input-note').value.trim();
    const fromId = modal.querySelector('#from-account').value;
    const toId = modal.querySelector('#to-account')?.value || null;
    const datetime = new Date(modal.querySelector('#input-date').value);

    if (isNaN(amount) || amount <= 0) {
      alert('Jumlah tidak valid.');
      return;
    }

    await db.transactions.add({
      type: state.type,
      date: datetime.toISOString(),
      description: note,
      amount,
      accountId: fromId,
      toAccountId: state.type === 'transfer' ? toId : null
    });

    alert('Transaksi berhasil disimpan.');
    wrapper.remove();
  });

  // Tampilkan/hide to-account sesuai tipe transaksi
  const toSection = modal.querySelector('#to-account-section');
  if (state.type !== 'transfer') {
    toSection.classList.add('hidden');
  }
}
