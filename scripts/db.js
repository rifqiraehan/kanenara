// scripts/db.js (versi untuk CDN, tanpa import)

// Inisialisasi database menggunakan Dexie dari global window
const db = new Dexie('MoneyTrackerDB');

// Skema database
// 'id' diset manual karena kamu ingin default ID-nya tetap ('1', '2', '3')
db.version(1).stores({
  accounts: 'id, name, initialBalance, color',
  transactions: '++id, type, date, amount, accountId, toAccountId',
  settings: 'key'
});

// Default akun yang disediakan saat aplikasi pertama kali dibuka
const defaultAccounts = [
  { id: '1', name: 'Common Wealth', initialBalance: 0, color: 'gray' },
  { id: '2', name: 'E-Money', initialBalance: 0, color: 'yellow' },
  { id: '3', name: 'Cash', initialBalance: 0, color: 'green' }
];

// Fungsi inisialisasi akun
async function seedDefaultAccounts() {
  const count = await db.accounts.count();
  if (count === 0) {
    await db.accounts.bulkAdd(defaultAccounts);
    console.log('[Seed] Akun default berhasil ditambahkan.');
  }
}

// Jalankan inisialisasi saat modul dimuat
seedDefaultAccounts();

// Ekspor global supaya bisa digunakan di file lain
window.db = db;