import { useState, useEffect } from "react";
import { usePurities } from "../../../Hook/usePurities";
import useAuth from "../../../Hook/useAuth";

const Purity = () => {

  const { branch } = useAuth();
  

  const {
    purities,
    pagination,
    loading,
    error,
    fetchPurities,
    createPurity,
    updatePurity,
    deletePurity
  } = usePurities();


  const [formData, setFormData] = useState({ purityName: "" });
  const [editId, setEditId] = useState(null);

  
  // FIX: Ensure branch is available before fetching
  useEffect(() => {
    if (branch) {
      fetchPurities(1, 10);
    }
  }, [fetchPurities, branch]);


// handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editId) {
      result = await updatePurity(editId, formData);
    } else {
      result = await createPurity(formData);
    }

    if (result) {
      setFormData({ purityName: "" });
      setEditId(null);
      fetchPurities(pagination?.currentPage || 1, 10);
    }
  };


  // handleUpdate
  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({ purityName: item.purityName });
  };


  // handleDelete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purity?")) {
      const success = await deletePurity(id);
      if (success) fetchPurities(pagination?.currentPage || 1, 10);
    }
  };



// Main
  return (
    <div className="p-6 max-w-4xl mx-auto bg-secondary min-h-screen">
      <h1 className="text-center text-3xl font-bold text-primary mb-8">
        Purity Management ({branch})
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Purity Name</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 p-2 rounded-md focus:border-primary outline-none transition"
              placeholder="e.g. 22 Carat, 950 Platinum"
              value={formData.purityName}
              onChange={(e) => setFormData({ purityName: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-md font-bold hover:brightness-110 disabled:bg-gray-400 transition"
            >
              {editId ? "Update Purity" : "Add Purity"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setFormData({ purityName: "" }); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* List Section */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-white uppercase text-xs">
            <tr>
              <th className="p-4 border-b border-white/20">Purity Name</th>
              <th className="p-4 border-b border-white/20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && purities.length === 0 ? (
               <tr><td colSpan="2" className="p-10 text-center text-gray-400">Loading...</td></tr>
            ) : (
              purities.map((item, index) => (
                <tr key={item._id} className={`hover:bg-secondary transition ${index % 2 !== 0 ? 'bg-secondary/30' : 'bg-white'}`}>
                  <td className="p-4 border-b font-medium">{item.purityName}</td>
                  <td className="p-4 border-b text-right space-x-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                  </td>
                </tr>
              ))
            )}
            {!loading && purities.length === 0 && (
              <tr><td colSpan="2" className="p-10 text-center text-gray-400">No purities found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FIX: Simplified Pagination Visibility Check */}
      {pagination?.totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            type="button"
            disabled={pagination.currentPage <= 1 || loading}
            onClick={() => fetchPurities(pagination.currentPage - 1, 10)}
            className="px-4 py-1 border border-primary text-primary bg-white rounded disabled:opacity-30 hover:bg-secondary transition"
          >
            Prev
          </button>
          
          <span className="text-gray-600 font-medium">
            Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
          </span>
          
          <button
            type="button"
            disabled={pagination.currentPage >= pagination.totalPages || loading}
            onClick={() => fetchPurities(pagination.currentPage + 1, 10)}
            className="px-4 py-1 border border-primary text-primary bg-white rounded disabled:opacity-30 hover:bg-secondary transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Purity;