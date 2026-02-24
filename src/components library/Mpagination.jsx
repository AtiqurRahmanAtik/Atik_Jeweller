import React, { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";



const Mpagination = ({ totalData }) => {
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedData = totalData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const numberOfPages = Math.ceil(totalData.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numberOfPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPage = (e) => {
    const val = parseInt(e.target.value, 10);
    setItemsPerPage(val);
    setCurrentPage(0);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const ellipsis = <span className="px-3 py-2 text-gray-500">...</span>;

    if (numberOfPages <= 5) {
      // If there are 5 or fewer pages, show them all
      for (let i = 0; i < numberOfPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
              currentPage === i
                ? "bg-blue-500 rounded-xl text-white hover:bg-blue-700"
                : "bg-transparent hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // More than 5 pages, show partial page numbers with ellipsis
      if (currentPage <= 2) {
        // Show first 3 pages
        for (let i = 0; i < 3; i++) {
          pageNumbers.push(
            <button
              key={i}
              className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
                currentPage === i
                  ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                  : "bg-transparent hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </button>
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <button
            key={numberOfPages - 1}
            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
              currentPage === numberOfPages - 1
                ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                : "bg-transparent hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(numberOfPages - 1)}
          >
            {numberOfPages}
          </button>
        );
      } else if (currentPage >= numberOfPages - 3) {
        // Show last 3 pages
        pageNumbers.push(
          <button
            key={0}
            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
              currentPage === 0
                ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                : "bg-transparent hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(0)}
          >
            1
          </button>
        );
        pageNumbers.push(ellipsis);
        for (let i = numberOfPages - 3; i < numberOfPages; i++) {
          pageNumbers.push(
            <button
              key={i}
              className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
                currentPage === i
                  ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                  : "bg-transparent hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </button>
          );
        }
      } else {
        // Show middle pages with ellipsis on both sides
        pageNumbers.push(
          <button
            key={0}
            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
              currentPage === 0
                ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                : "bg-transparent hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(0)}
          >
            1
          </button>
        );
        pageNumbers.push(ellipsis);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(
            <button
              key={i}
              className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
                currentPage === i
                  ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                  : "bg-transparent hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </button>
          );
        }
        pageNumbers.push(ellipsis);
        pageNumbers.push(
          <button
            key={numberOfPages - 1}
            className={`px-3 join-item text-sm py-2 focus:outline-none transition-colors duration-300 ease-in-out ${
              currentPage === numberOfPages - 1
                ? "bg-blue-500 rounded-xl text-white hover:bg-blue-600"
                : "bg-transparent hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(numberOfPages - 1)}
          >
            {numberOfPages}
          </button>
        );
      }
    }

    return pageNumbers;
  };

  const rowsPerPageAndTotal = (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">
        Total {totalData.length} items
      </span>
      <label className="flex items-center text-default-400 text-small">
        Rows per page:
        <select
          value={itemsPerPage}
          className="bg-transparent outline-none text-default-400 text-small"
          onChange={handleItemsPerPage}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </label>
    </div>
  );

  const paginationControls = (
    <div className="flex mt-3 items-center justify-between">
      {/* Pagination Controls */}
      <div className="flex justify-end">
        <div className="m-2 shadow rounded-lg max-w-min flex">
          <button
            className="join-item px-3 py-2 text-white rounded focus:outline-none hover:bg-gray-200"
            onClick={handlePrevPage}
          >
            <span className="text-black">
              <MdNavigateBefore />
            </span>
          </button>
          {renderPageNumbers()}
          <button
            className="px-3 py-2 text-white join-item rounded focus:outline-none hover:bg-gray-200"
            onClick={handleNextPage}
          >
            <span className="text-black">
              <MdNavigateNext />
            </span>
          </button>
        </div>
      </div>

      {/* Previous/Next Buttons */}
      <div className="hidden md:block">
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            className="text-xs bg-gray-100 px-4 rounded-md py-2 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="text-xs bg-gray-100 px-4 rounded-md py-2 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
  return { paginatedData, paginationControls, rowsPerPageAndTotal,itemsPerPage, setItemsPerPage,currentPage,setCurrentPage};;
};

export default Mpagination;
