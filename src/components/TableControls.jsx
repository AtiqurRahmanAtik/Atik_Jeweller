import React from 'react';

const TableControls = ({ itemsPerPage, onItemsPerPageChange, searchTerm, onSearchChange }) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-3">
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Show</span>
      <select
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <span className="text-sm text-gray-700">entries</span>
    </div>
    <div className="relative w-full md:w-80">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={onSearchChange}
        className="block p-2 ps-3 text-sm border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

export default TableControls;
