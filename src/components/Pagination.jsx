import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1 || totalItems === 0) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
      <div className="text-sm text-gray-700">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <nav>
        <ul className="flex items-center gap-1">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>
          </li>
          {pageNumbers.map(number => (
            <li key={number}>
              <button
                onClick={() => onPageChange(number)}
                className={`px-3 py-1 border border-gray-300 rounded hover:bg-blue-50 transition ${
                  currentPage === number ? 'bg-blue-100 text-blue-600 font-semibold' : 'bg-white text-gray-600'
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50"
              aria-label="Next"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
