import React, { useEffect, useState } from 'react';
// Make sure this path points to where you saved the usePurchases hook
import { usePurchases } from '../../../Hook/usePurchases'; 

const PurchaseList = () => {
  // --- Hook Integration ---
  const { purchases, pagination, loading, error, fetchPurchases } = usePurchases();
  
  // --- Local Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Items per page

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchPurchases(currentPage, limit);
  }, [currentPage, fetchPurchases]);

  // --- Helper Functions ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0.00';
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // --- Render States ---
  if (loading && purchases.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDF8EE] text-gray-500">Loading purchases...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDF8EE] text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-[#FDF8EE] font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase List</h1>
      
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center whitespace-nowrap">
            {/* Table Header */}
            <thead className="bg-[#c87b1e] text-white">
              <tr>
               
                <th className="py-3 px-4 font-semibold">Invoice #</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Supplier</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Metal Type</th>
                <th className="py-3 px-4 font-semibold">Purity</th>
                <th className="py-3 px-4 font-semibold">Weight</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Paid</th>
                <th className="py-3 px-4 font-semibold">Due</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-gray-500 text-center text-lg">No purchases found.</td>
                </tr>
              ) : (
                purchases.map((purchase, index) => {
                  // The UI shows product details in the main row. 
                  // Since 'products' is an array in your schema, we display the first product's details.
                  const primaryProduct = purchase.products && purchase.products.length > 0 ? purchase.products[0] : {};

                  return (
                    <tr 
                      key={purchase._id} 
                      className={`border-b border-gray-100 last:border-0 hover:bg-orange-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#fff9f0]'}`}
                    >
                     
                      
                      {/* Invoice Number */}
                      <td className="py-3 px-4">
                        <span className="bg-[#FDEEDC] text-[#c87b1e] px-3 py-1 rounded text-xs font-semibold tracking-wide">
                          {purchase.invoiceNumber}
                        </span>
                      </td>
                      
                      {/* Date & Supplier */}
                      <td className="py-3 px-4 text-gray-600">{formatDate(purchase.purchaseDate)}</td>
                      <td className="py-3 px-4 text-gray-500">{purchase.supplier}</td>
                      
                      {/* Product Details (Extracted from the first product in the array) */}
                      <td className="py-3 px-4 text-gray-600">{primaryProduct.phone || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{primaryProduct.metalType || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{primaryProduct.purity || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{primaryProduct.weight ? primaryProduct.weight.toFixed(2) : '-'}</td>
                      
                      {/* Financials */}
                      <td className="py-3 px-4 text-gray-400 font-medium">
                        ৳ {formatCurrency(purchase.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-green-600 font-medium">
                        ৳ {formatCurrency(purchase.paid)}
                      </td>
                      <td className="py-3 px-4 text-[#c87b1e] font-medium">
                        ৳ {formatCurrency(purchase.due)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-white">
            <span className="text-sm text-gray-500">
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total items)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Dynamic Page Numbers based on backend pagination */}
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={loading}
                    className={`px-3 py-1 border rounded text-sm transition-colors ${
                      currentPage === pageNumber 
                        ? 'bg-[#c87b1e] text-white border-[#c87b1e]' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PurchaseList;