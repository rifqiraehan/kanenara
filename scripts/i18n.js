export const translations = {
  en: {
    // General
    'success': 'Success',
    'error': 'Error',
    'warning': 'Warning',
    'info': 'Info',
    'dismiss_popup': 'Dismiss popup',
    'cancel': 'Cancel',
    'save': 'Save',
    'close': 'Close',

    // Account Form Modal
    'add_account': 'Add Account',
    'edit_account': 'Edit Account',
    'account_name': 'Account Name:',
    'account_name_placeholder': 'e.g., Bank Account',
    'balance': 'Balance:',
    'color': 'Color:',
    'remove': 'Remove',
    'account_name_empty_warning': 'Account name cannot be empty.',
    'invalid_balance_warning': 'Invalid balance.',
    'account_updated_success': 'Account successfully updated!',
    'account_added_success': 'Account successfully added!',
    'failed_to_save_account': 'Failed to save account.',
    'confirm_delete_account_title': 'Confirm Deletion',
    'confirm_delete_account_message': 'Are you sure you want to delete account "{accountName}"? This action will also delete all related transactions.',
    'account_deleted_success': 'Account successfully deleted!',
    'failed_to_delete_account': 'Failed to delete account.',
    'account_deletion_cancelled': 'Account deletion cancelled.',
    'account_not_found': 'Account not found.',

    // Confirm Modal (General)
    'confirm_deletion': 'Confirm Deletion',

    // Confirm Import Modal
    'confirm_import_data': 'Confirm Data Import',
    'import_warning_message': 'WARNING: This process will delete all your old data!',
    'import_confirm_question': 'Are you sure you want to proceed with the import and overwrite all current application data?',
    'proceed_import': 'Proceed Import',
    'import_file_not_selected': 'No file selected.',
    'invalid_json_file': 'Only JSON files are allowed.',
    'invalid_json_structure': 'Invalid JSON file structure.',
    'data_imported_success': 'Data imported and updated successfully!',
    'failed_to_read_import_file': 'Failed to read or import data file.',

    // Confirm Conversion Modal
    'confirm_currency_change': 'Confirm Currency Change',
    'conversion_warning_message': 'WARNING: All stored amounts will be converted!',
    'conversion_confirm_question': 'Are you sure you want to change the main currency to {newCurrency}? This change will permanently convert all recorded amounts across your transactions.',
    'change_save': 'Change & Save',
    'currency_settings_saved_converted': 'Currency settings saved and data converted!',
    'failed_to_save_currency_settings': 'Failed to save settings or convert currency.',

    // Settings Modal
    'settings': 'Settings',
    'main_currency': 'Main Currency',
    'us_dollar': 'US Dollar',
    'indonesia_rupiah': 'Indonesia Rupiah',
    'fetching_exchange_rate': 'Fetching current exchange rate...',
    'default_exchange_rate_info': '1 USD = IDR 16.000,00',
    'data_option': 'Data Option',
    'export': 'Export',
    'import': 'Import',
    'data_exported_success': 'Data successfully exported!',
    'failed_to_export_data': 'Failed to export data.',
    'failed_to_fetch_exchange_rate': 'Failed to fetch USD ↔ IDR exchange rate. Using default value 16000.',

    // Account Modal
    'accounts': 'Accounts',
    'add_new_account': '+ Add New Account',

    // Transaction List
    'daily_total': 'Σ {sign} {amount}',
    'date_label': 'Date:',
    'balance_label': 'Balance:',
    'transaction_not_found': 'Transaction not found.',
    'update_balance': 'Update Balance',

    // Transaction Modal
    'edit_transaction': 'Edit Transaction',
    'add_transaction': 'Add Transaction',
    'income': 'Income',
    'expense': 'Expense',
    'transfer': 'Transfer',
    'date_and_time': 'Date & Time:',
    'from_account': 'From Account:',
    'to_account': 'To Account:',
    'add_description_placeholder': 'add description...',
    'invalid_amount_warning': 'Invalid amount.',
    'transaction_updated_success': 'Transaction successfully updated!',
    'transaction_added_success': 'Transaction successfully added!',
    'confirm_delete_transaction_message': 'Are you sure you want to delete this transaction?',
    'transaction_deleted_success': 'Transaction successfully deleted!',
    'failed_to_delete_transaction': 'Failed to delete transaction.',

    'total_balance_title': 'Total Balance',
    'daily_flow_title': 'Daily Balance Trend',
    'account_menu_tooltip': 'Account',
    'add_transaction_tooltip': 'Add Transaction',
    'settings_menu_tooltip': 'Settings',
    'accounts_section_title': 'Accounts',
    'transactions_section_title': 'Transactions',
    'settings_saved': 'Settings saved successfully!',
    'failed_to_save_settings': 'Failed to save settings.',
    'select_color': 'Select {color} color',
    'settings_saved': 'Settings saved successfully!',
    'failed_to_save_settings': 'Failed to save settings.',
    'database_not_available': 'Database not available.',
    'app_language': 'App Language',
  },
  id: {
    // General
    'success': 'Berhasil',
    'error': 'Error',
    'warning': 'Peringatan',
    'info': 'Info',
    'dismiss_popup': 'Tutup pop-up',
    'cancel': 'Batal',
    'save': 'Simpan',
    'close': 'Tutup',

    // Account Form Modal
    'add_account': 'Tambah Akun',
    'edit_account': 'Edit Akun',
    'account_name': 'Nama Akun:',
    'account_name_placeholder': 'contoh: Rekening Bank',
    'balance': 'Saldo:',
    'color': 'Warna:',
    'remove': 'Hapus',
    'account_name_empty_warning': 'Nama akun tidak boleh kosong.',
    'invalid_balance_warning': 'Saldo tidak valid.',
    'account_updated_success': 'Akun berhasil diperbarui!',
    'account_added_success': 'Akun berhasil ditambahkan!',
    'failed_to_save_account': 'Gagal menyimpan akun.',
    'confirm_delete_account_title': 'Konfirmasi Penghapusan',
    'confirm_delete_account_message': 'Apakah Anda yakin ingin menghapus akun "{accountName}"? Tindakan ini juga akan menghapus semua transaksi yang terkait.',
    'account_deleted_success': 'Akun berhasil dihapus!',
    'failed_to_delete_account': 'Gagal menghapus akun.',
    'account_deletion_cancelled': 'Penghapusan akun dibatalkan.',
    'account_not_found': 'Akun tidak ditemukan.',

    // Confirm Modal (General)
    'confirm_deletion': 'Konfirmasi Penghapusan',

    // Confirm Import Modal
    'confirm_import_data': 'Konfirmasi Import Data',
    'import_warning_message': 'PERINGATAN: Proses ini akan menghapus semua data lama Anda!',
    'import_confirm_question': 'Apakah Anda yakin ingin melanjutkan import dan menimpa seluruh data aplikasi saat ini?',
    'proceed_import': 'Lanjutkan Import',
    'import_file_not_selected': 'Tidak ada file yang dipilih.',
    'invalid_json_file': 'Hanya file JSON yang diizinkan.',
    'invalid_json_structure': 'Struktur file JSON tidak valid.',
    'data_imported_success': 'Data berhasil diimpor dan diperbarui!',
    'failed_to_read_import_file': 'Gagal membaca atau mengimpor file data.',

    // Confirm Conversion Modal
    'confirm_currency_change': 'Konfirmasi Perubahan Currency',
    'conversion_warning_message': 'PERINGATAN: Semua nominal yang disimpan akan dikonversi!',
    'conversion_confirm_question': 'Apakah Anda yakin ingin mengubah mata uang utama menjadi {newCurrency}? Perubahan ini akan secara permanen mengubah semua nominal yang tercatat di seluruh transaksi Anda.',
    'change_save': 'Ubah & Simpan',
    'currency_settings_saved_converted': 'Pengaturan mata uang berhasil disimpan dan data dikonversi!',
    'failed_to_save_currency_settings': 'Gagal menyimpan pengaturan atau mengonversi mata uang.',

    // Settings Modal
    'settings': 'Pengaturan',
    'main_currency': 'Mata Uang Utama',
    'us_dollar': 'Dolar AS',
    'indonesia_rupiah': 'Rupiah Indonesia',
    'fetching_exchange_rate': 'Mengambil nilai tukar terkini...',
    'default_exchange_rate_info': '1 USD = IDR 16.000,00',
    'data_option': 'Opsi Data',
    'export': 'Ekspor',
    'import': 'Impor',
    'data_exported_success': 'Data berhasil diekspor!',
    'failed_to_export_data': 'Gagal mengekspor data.',
    'failed_to_fetch_exchange_rate': 'Gagal mengambil nilai tukar USD ↔ IDR. Gunakan nilai default 16000.',

    // Account Modal
    'accounts': 'Akun',
    'add_new_account': '+ Tambah Akun Baru',

    // Transaction List
    'daily_total': 'Σ {sign} {amount}',
    'date_label': 'Tanggal:',
    'balance_label': 'Saldo:',
    'transaction_not_found': 'Transaksi tidak ditemukan.',
    'update_balance': 'Perbarui Saldo',

    // Transaction Modal
    'edit_transaction': 'Edit Transaksi',
    'add_transaction': 'Tambah Transaksi',
    'income': 'Pemasukan',
    'expense': 'Pengeluaran',
    'transfer': 'Transfer',
    'date_and_time': 'Tanggal & Waktu:',
    'from_account': 'Dari Akun:',
    'to_account': 'Ke Akun:',
    'add_description_placeholder': 'tambah deskripsi...',
    'invalid_amount_warning': 'Jumlah tidak valid.',
    'transaction_updated_success': 'Transaksi berhasil diperbarui!',
    'transaction_added_success': 'Transaksi berhasil ditambahkan!',
    'confirm_delete_transaction_message': 'Apakah Anda yakin ingin menghapus transaksi ini?',
    'transaction_deleted_success': 'Transaksi berhasil dihapus!',
    'failed_to_delete_transaction': 'Gagal menghapus transaksi.',

    'total_balance_title': 'Total Saldo',
    'daily_flow_title': 'Tren Saldo Harian',
    'account_menu_tooltip': 'Akun',
    'add_transaction_tooltip': 'Tambah Transaksi',
    'settings_menu_tooltip': 'Pengaturan',
    'accounts_section_title': 'Akun',
    'transactions_section_title': 'Transaksi',
    'settings_saved': 'Pengaturan berhasil disimpan!',
    'failed_to_save_settings': 'Gagal menyimpan pengaturan.',
    'select_color': 'Pilih warna {color}',
    'settings_saved': 'Pengaturan berhasil disimpan!',
    'failed_to_save_settings': 'Gagal menyimpan pengaturan.',
    'database_not_available': 'Database tidak tersedia.',
    'app_language': 'Bahasa Aplikasi',
  }
};

export function getTranslation(key, ...args) {
  const lang = window.currentLanguage || 'id';
  let text = translations[lang][key] || translations['en'][key] || key;

  if (args.length > 0) {
    args.forEach((arg, index) => {

      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        for (const placeholder in arg) {
          text = text.replace(`{${placeholder}}`, arg[placeholder]);
        }
      } else {

      }
    });
  }

  return text;
}