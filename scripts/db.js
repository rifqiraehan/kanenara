const db = new Dexie('MoneyTrackerDB');

db.version(1).stores({
  accounts: '++id, name, initialBalance, color',
  transactions: '++id, type, date, amount, accountId, toAccountId',
  settings: 'key'
});

const defaultAccounts = [
  { name: 'Bank A', initialBalance: 0, color: 'blue' },
  { name: 'Digital Wallet 1', initialBalance: 0, color: 'yellow' },
  { name: 'Cash', initialBalance: 0, color: 'green' }
];

async function seedDefaultAccounts() {
  const count = await db.accounts.count();
  if (count === 0) {
    await db.accounts.bulkAdd(defaultAccounts);
    console.log('[Seed] Akun default berhasil ditambahkan.');
  }
}

async function seedDefaultSettings() {
  const currencySetting = await db.settings.get('main-currency');
  if (currencySetting === undefined) {
    await db.settings.put({ key: 'main-currency', value: 0 });
    console.log('[Seed] Pengaturan mata uang default ditambahkan (IDR).');
  }
}

seedDefaultAccounts();
seedDefaultSettings();

window.db = db;