export function createPaginationControls({ currentPage, totalPages, onPageChange }) {
  const container = document.createElement('div');
  container.className = 'flex justify-center items-center gap-4 mt-4 text-sm text-gray-700';

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '<i class="fas fa-angle-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `px-3 py-1 rounded ${prevBtn.disabled ? 'text-gray-400' : 'hover:bg-gray-200'}`;
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));

  const pageLabel = document.createElement('span');
  pageLabel.textContent = `${currentPage} / ${totalPages}`;

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '<i class="fas fa-angle-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `px-3 py-1 rounded ${nextBtn.disabled ? 'text-gray-400' : 'hover:bg-gray-200'}`;
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));

  container.append(prevBtn, pageLabel, nextBtn);
  return container;
}