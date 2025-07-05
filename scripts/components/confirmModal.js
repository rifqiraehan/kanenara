import { getTranslation } from '../i18n.js';

export function openConfirmDeleteModal(message, onConfirm, onCancel) {
  const wrapper = document.createElement('div');
  wrapper.id = 'confirm-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]';

  wrapper.innerHTML = `
    <div class="bg-white w-72 rounded-lg p-6 space-y-4 shadow-xl relative">
      <h3 class="text-lg font-semibold text-center text-gray-800">${getTranslation('confirm_deletion')}</h3>
      <p class="text-sm text-center text-gray-600">${message}</p>
      <div class="flex justify-center gap-4 pt-2">
        <button id="confirm-delete-btn" class="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">${getTranslation('confirm')}</button>
        <button id="cancel-delete-btn" class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">${getTranslation('cancel')}</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const confirmBtn = wrapper.querySelector('#confirm-delete-btn');
  const cancelBtn = wrapper.querySelector('#cancel-delete-btn');

  const closeConfirmModal = () => {
    wrapper.remove();
  };

  confirmBtn.addEventListener('click', () => {
    closeConfirmModal();
    if (onConfirm) onConfirm();
  });

  cancelBtn.addEventListener('click', () => {
    closeConfirmModal();
    if (onCancel) onCancel();
  });
}