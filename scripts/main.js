// scripts/main.js
import { openTransactionModal } from './components/transactionForm.js';

document.addEventListener('DOMContentLoaded', () => {
  const addTransactionBtn = document.querySelector('[data-action="add-transaction"]');

  if (addTransactionBtn) {
    addTransactionBtn.addEventListener('click', openTransactionModal);
  }

  // Inisialisasi db.js agar seed akun berjalan (sudah global via window.db)
  if (!window.db) {
    console.error('IndexedDB tidak terdeteksi. Pastikan Dexie CDN dimuat.');
  }
});