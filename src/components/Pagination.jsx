import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 6,
  onPageChange,
}) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200 mt-6 px-1">
      <div className="text-xs sm:text-sm text-stone-600 font-medium">
        Menampilkan <span className="font-bold text-stone-900">{startItem}</span> -{' '}
        <span className="font-bold text-stone-900">{endItem}</span> dari{' '}
        <span className="font-bold text-stone-900">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="p-1.5 sm:p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-forest-900 hover:border-stone-300 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-stone-400 font-bold select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Halaman ${page}`}
                className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-forest-800 text-white shadow-sm border border-forest-900'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-forest-900 hover:border-stone-300'
                }`}
                style={isActive ? { color: '#ffffff', backgroundColor: '#1b4332' } : {}}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="p-1.5 sm:p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:text-forest-900 hover:border-stone-300 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
