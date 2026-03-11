import React, { useEffect, useState } from "react";
import { useStocks } from "../../Hook/useStocks"; 
import useAuth from "../../Hook/useAuth"; 

const MyStocks = () => {

  const {
    stocks,
    pagination,
    loading,
    fetchStocks,
    createStock,
    updateStock,
    deleteStock
  } = useStocks();

  const { branch } = useAuth();

  const [stockType, setStockType] = useState("");
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX: explicitly pass page 1 and limit 10 on mount
  useEffect(() => {
    fetchStocks(1, 10);
  }, [fetchStocks]);
  

  // OPEN ADD MODAL
  const handleAdd = () => {
    setStockType("");
    setEditId(null);
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (item) => {
    setStockType(item.stockType);
    setEditId(item._id);
    setIsModalOpen(true);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    let success;

    if (editId) {
      success = await updateStock(editId, { stockType });
    } else {
      success = await createStock({ stockType });
    }

    if (success) {
      setIsModalOpen(false);
      setStockType("");
      setEditId(null);
      // FIX: refresh the current page, keeping the limit at 10
      fetchStocks(pagination?.currentPage || 1, 10);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this stock type?");
    if (!confirm) return;

    const success = await deleteStock(id);

    if (success) {
      // FIX: refresh the current page, keeping the limit at 10
      fetchStocks(pagination?.currentPage || 1, 10);
    }
  };



  return (

    <div className="p-10 bg-secondary min-h-screen">

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          My Stocks ({branch})
        </h1>

        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          Add Stock Type
        </button>

      </div>

      {/* TABLE */}

      {loading && !stocks?.length ? (
        <p className="text-gray-500">Loading stocks...</p>
      ) : (

        <table className="w-full border text-center bg-white shadow-sm">

          <thead className="bg-primary text-white">

            <tr>
              <th className="p-2 border border-white/20">#</th>
              <th className="p-2 border border-white/20">Stock Type</th>
              
              <th className="p-2 border border-white/20">Action</th>
            </tr>

          </thead>

          <tbody>

            {stocks?.map((item, index) => (

              <tr key={item._id} className={index % 2 === 0 ? "bg-white" : "bg-secondary"}>

                <td className="border p-2">
                  {/* Calculate absolute index across pages */}
                  {((pagination?.currentPage || 1) - 1) * 10 + index + 1}
                </td>

                <td className="border p-2 font-medium">
                  {item.stockType}
                </td>

               

                <td className="border p-2 flex gap-2 justify-center">

                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-white border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

            {stocks?.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-gray-500 bg-white">
                  No stocks found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      )}

      {/* FIXED PAGINATION */}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">

          <button
            type="button"
            disabled={pagination.currentPage === 1 || loading}
            // FIX: added '10' for limit
            onClick={() => fetchStocks(pagination.currentPage - 1, 10)}
            className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
          >
            Prev
          </button>

          <span className="font-medium text-primary flex items-center">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={pagination.currentPage === pagination.totalPages || loading}
            // FIX: added '10' for limit
            onClick={() => fetchStocks(pagination.currentPage + 1, 10)}
            className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
          >
            Next
          </button>

        </div>
      )}

      {/* MODAL */}

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96 shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-primary">

              {editId ? "Update Stock Type" : "Add Stock Type"}

            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="e.g. Customized Order Stock"
                value={stockType}
                onChange={(e) => setStockType(e.target.value)}
                className="w-full border p-2 rounded mb-4 focus:outline-primary focus:border-primary"
                required
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyStocks;