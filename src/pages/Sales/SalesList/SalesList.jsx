import React, { useEffect } from "react";
import useSales from "../../../Hook/useSales"; // Adjust the import path if necessary

const SalesList = () => {
  const { sales, loading, error, getAllSales } = useSales();

  // Fetch sales data when the component mounts
  useEffect(() => {
    getAllSales(1, 10); // Fetching page 1, 10 items per page
  }, [getAllSales]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format currency helper (Bangladeshi Taka based on image)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return "৳ 0.00";
    return `৳ ${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 font-sans">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1A2639]">Sales List</h2>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-100">
        <table className="w-full text-sm text-left whitespace-nowrap">
          {/* Table Head */}
          <thead className="bg-[#D48B2B] text-white">
            <tr>
              <th className="px-6 py-4 font-semibold rounded-tl-lg">Invoice #</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-center"> Customer</th>
              <th className="px-6 py-4 font-semibold text-center">Phone</th>
              <th className="px-6 py-4 font-semibold text-center">Metal Type</th>
              <th className="px-6 py-4 font-semibold text-center">Purity</th>
              <th className="px-6 py-4 font-semibold text-right">Weight</th>
              <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
              <th className="px-6 py-4 font-semibold text-right">Paid</th>
              <th className="px-6 py-4 font-semibold text-right rounded-tr-lg">Due</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-600">
            {loading ? (
              <tr>
                <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                  Loading sales data...
                </td>
              </tr>
            ) : sales?.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                  No sales records found.
                </td>
              </tr>
            ) : (
              sales?.map((sale, index) => (
                <tr
                  key={sale._id || index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Invoice Badge */}
                  <td className="px-6 py-4">
                    <span className="bg-[#FEF3E6] text-[#D48B2B] px-3 py-1.5 rounded text-xs font-medium tracking-wide">
                      {sale.invoiceNumber || `#INV-${sale._id?.slice(-8).toUpperCase() || 'N/A'}`}
                    </span>
                  </td>

                  {/* Date - Updated to use saleDate from JSON if available */}
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(sale.saleDate || sale.createdAt)}
                  </td>

                  {/* Supplier/Customer */}
                  <td className="px-6 py-4 text-center text-gray-700">
                    {sale.customer || sale.supplier || "N/A"}
                  </td>

                  {/* Phone - Updated to check inside the products array based on JSON */}
                  <td className="px-6 py-4 text-center text-gray-500">
                    {sale.products?.[0]?.phone || sale.phone || "N/A"}
                  </td>

                  {/* Metal Type - Updated to check inside the products array */}
                  <td className="px-6 py-4 text-center text-gray-600">
                    {sale.products?.[0]?.metalType || sale.metalType || "N/A"}
                  </td>

                  {/* Purity - Updated to check inside the products array */}
                  <td className="px-6 py-4 text-center text-gray-600">
                    {sale.products?.[0]?.purity || sale.purity || "N/A"}
                  </td>

                  {/* Weight - Updated to check inside the products array */}
                  <td className="px-6 py-4 text-right text-gray-600">
                    {Number(sale.products?.[0]?.weight || sale.weight || 0).toFixed(2)}
                  </td>

                  {/* Total Amount - Updated to use 'total' from JSON */}
                  <td className="px-6 py-4 text-right font-medium text-[#B39D82]">
                    {formatCurrency(sale.total || sale.totalAmount || 0)}
                  </td>

                  {/* Paid */}
                  <td className="px-6 py-4 text-right font-medium text-[#10B981]">
                    {formatCurrency(sale.paid || 0)}
                  </td>

                  {/* Due */}
                  <td className="px-6 py-4 text-right font-medium text-[#D48B2B]">
                    {formatCurrency(sale.due || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;