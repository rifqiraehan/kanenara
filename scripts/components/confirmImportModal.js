export function openConfirmImportModal(onConfirm, onCancel) {
  const wrapper = document.createElement('div');
  wrapper.id = 'confirm-import-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]';

  wrapper.innerHTML = `
    <div class="bg-white w-80 rounded-lg p-6 space-y-4 shadow-xl relative">
      <h3 class="text-lg font-semibold text-center text-gray-800">Konfirmasi Import Data</h3>
      <p class="mt-2 text-sm text-center text-red-600 font-semibold">
        PERINGATAN: Proses ini akan menghapus semua data lama Anda!
      </p>
      <p class="text-sm text-center text-gray-600">
        Apakah Anda yakin ingin melanjutkan import dan menimpa seluruh data aplikasi saat ini?
      </p>
      <div class="flex flex-col items-center gap-2 pt-2">
        <button id="confirm-import-btn" class="w-full px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">
          Lanjutkan Import
        </button>
        <button id="cancel-import-btn" class="w-full px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
          Batal
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const confirmBtn = wrapper.querySelector('#confirm-import-btn');
  const cancelBtn = wrapper.querySelector('#cancel-import-btn');

  const closeModal = () => wrapper.remove();

  confirmBtn.addEventListener('click', () => {
    closeModal();
    if (onConfirm) onConfirm();
  });

  cancelBtn.addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });
}
