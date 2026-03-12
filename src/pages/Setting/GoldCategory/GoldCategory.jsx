import React, { useEffect, useState } from "react";
import { useGoldCategories } from "../../../Hook/useGoldCategories";
import useAuth from "../../../Hook/useAuth";

const GoldCategory = () => {
  const {
    goldCategories,
    pagination,
    loading,
    fetchGoldCategories,
    createGoldCategory,
    updateGoldCategory,
    deleteGoldCategory
  } = useGoldCategories();

  // const { branch } = useAuth();

  // State matching MetalType structure
  const [formData, setFormData] = useState({ categoryName: "", categoryImage: "" });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGoldCategories();
  }, [fetchGoldCategories]);

  // OPEN ADD MODAL
  const handleAdd = () => {
    setFormData({ categoryName: "", categoryImage: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL (Shows existing data in modal)
  const handleEdit = (item) => {
    setFormData({ 
      categoryName: item.categoryName, 
      categoryImage: item.categoryImage 
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  // SUBMIT FORM (Handles both Create and Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let success;

    if (editId) {
      success = await updateGoldCategory(editId, formData);
    } else {
      success = await createGoldCategory(formData);
    }

    if (success) {
      setIsModalOpen(false);
      setFormData({ categoryName: "", categoryImage: "" });
      setEditId(null);
      fetchGoldCategories(pagination.currentPage); // Refresh current page
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this gold category?");
    if (!confirm) return;

    const success = await deleteGoldCategory(id);

    if (success) {
      fetchGoldCategories(pagination.currentPage);
    }
  };

  

  return (
    <div className="p-10 bg-secondary min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Product Categories</h1>

        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all"
        >
          Add Gold Category
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-center bg-white shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-2 border border-white/20">#</th>
              <th className="p-2 border border-white/20">Image</th>
              <th className="p-2 border border-white/20">Category Name</th>
             
              <th className="p-2 border border-white/20">Action</th>
            </tr>
          </thead>

          <tbody>
            {goldCategories?.map((item, index) => (
              <tr key={item._id} className={index % 2 === 0 ? "bg-white" : "bg-secondary"}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  <img 
                    src={item.categoryImage} 
                    alt="" 
                    className="w-10 h-10 object-cover mx-auto rounded shadow-sm" 
                  />
                </td>
                <td className="border p-2 font-medium">{item.categoryName}</td>
                
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
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => fetchGoldCategories(pagination.currentPage - 1)}
          className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
        >
          Prev
        </button>

        <span className="font-medium text-primary flex items-center">
          Page {pagination.currentPage} / {pagination.totalPages}
        </span>

        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => fetchGoldCategories(pagination.currentPage + 1)}
          className="border border-primary text-primary bg-white hover:bg-secondary disabled:border-gray-300 disabled:text-gray-400 px-3 py-1 rounded transition-colors"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-primary">
              {editId ? "Update Gold Category" : "Add Gold Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Category Name</label>
                  <input
                    type="text"
                    placeholder="Enter Category Name"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="Enter Image URL"
                    value={formData.categoryImage}
                    onChange={(e) => setFormData({ ...formData, categoryImage: e.target.value })}
                    className="w-full border p-2 rounded focus:outline-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:brightness-110 transition-all"
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

export default GoldCategory;