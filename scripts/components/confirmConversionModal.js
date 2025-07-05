import { getTranslation } from '../i18n.js';

export function openConfirmConversionModal(message, onConfirm, onCancel) {
  const wrapper = document.createElement('div');
  wrapper.id = 'confirm-conversion-modal';
  wrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]';

  wrapper.innerHTML = `
    <div class="bg-white w-80 rounded-lg p-6 space-y-4 shadow-xl relative">
      <h3 class="text-lg font-semibold text-center text-gray-800">${getTranslation('confirm_currency_change')}</h3>
      <p class="mt-2 text-sm text-center text-red-600 font-semibold">
          ${getTranslation('conversion_warning_message')}
      </p>
      <p class="text-sm text-center text-gray-600">${message}</p>
      <div class="flex flex-col items-center gap-2 pt-2">
        <button id="confirm-convert-btn" class="w-full px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-600 cursor-pointer">
          ${getTranslation('change_save')}
        </button>
        <button id="cancel-convert-btn" class="w-full px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-100 active:bg-gray-100 cursor-pointer">
          ${getTranslation('cancel')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);

  const confirmBtn = wrapper.querySelector('#confirm-convert-btn');
  const cancelBtn = wrapper.querySelector('#cancel-convert-btn');

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