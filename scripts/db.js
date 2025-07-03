const db = new Dexie('MoneyTrackerDB');

db.version(1).stores({
  accounts: 'id, name, initialBalance, color',
  transactions: '++id, type, date, amount, accountId, toAccountId',
  settings: 'key'
});

const defaultAccounts = [
  { id: '1', name: 'Common Wealth', initialBalance: 0, color: 'blue' },
  { id: '2', name: 'E-Money', initialBalance: 0, color: 'yellow' },
  { id: '3', name: 'Cash', initialBalance: 0, color: 'green' }
];

async function seedDefaultAccounts() {
  const count = await db.accounts.count();
  if (count === 0) {
    await db.accounts.bulkAdd(defaultAccounts);
    console.log('[Seed] Akun default berhasil ditambahkan.');
  }
}

seedDefaultAccounts();

window.db = db;