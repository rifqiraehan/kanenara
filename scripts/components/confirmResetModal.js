import { getTranslation } from '../i18n.js';

export function openConfirmResetModal(onConfirm, onCancel) {
  const wrapper = document.createElement('div');
  wrapper.id = 'confirm-reset-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]';

  wrapper.innerHTML = `
    <div class="bg-white w-80 rounded-lg p-6 space-y-4 shadow-xl relative">
      <h3 class="text-lg font-semibold text-center text-gray-800">${getTranslation('confirm_reset_data_title')}</h3>
      <p class="mt-2 text-sm text-center text-red-600 font-semibold">
        ${getTranslation('reset_warning_message')}
      </p>
      <p class="text-sm text-center text-gray-600">
        ${getTranslation('reset_confirm_question')}
      </p>
      <div class="flex flex-col items-center gap-2 pt-2">
        <button id="confirm-reset-btn" class="w-full px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">
          ${getTranslation('proceed_reset')}
        </button>
        <button id="cancel-reset-btn" class="w-full px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
          ${getTranslation('cancel')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const confirmBtn = wrapper.querySelector('#confirm-reset-btn');
  const cancelBtn = wrapper.querySelector('#cancel-reset-btn');

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