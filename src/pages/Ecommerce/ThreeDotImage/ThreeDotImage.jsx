import React, { useEffect, useState } from "react";
import { useThreeDotImages } from "../../../Hook/useThreeDotImages"; 
import { Plus, Edit, Trash2 } from "lucide-react";

const ThreeDotImage = () => {
  const {
    threeDotImages,
    pagination,
    loading,
    fetchThreeDotImages,
    createThreeDotImage,
    updateThreeDotImage,
    deleteThreeDotImage,
  } = useThreeDotImages();

  // Form States for Modal
  const [formData, setFormData] = useState({
    imageName: "",
    imageUrl: "",
  });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data on load
  useEffect(() => {
    fetchThreeDotImages();
  }, [fetchThreeDotImages]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // OPEN ADD MODAL
  const handleAdd = () => {
    setFormData({ imageName: "", imageUrl: "" });
    setEditId(null);
    setIsModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (item) => {
    setFormData({
      imageName: item.imageName,
      imageUrl: item.imageUrl,
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (editId) {
      success = await updateThreeDotImage(editId, formData);
    } else {
      success = await createThreeDotImage(formData);
    }

    if (success) {
      setIsModalOpen(false);
      setFormData({ imageName: "", imageUrl: "" });
      setEditId(null);
      fetchThreeDotImages(pagination.currentPage);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    const success = await deleteThreeDotImage(id);
    if (success) fetchThreeDotImages(pagination.currentPage);
  };

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1e293b]">
          Manage Three Dot Images
        </h1>
        <button
          onClick={handleAdd}
          className="bg-[#dcae3d] text-white px-5 py-2.5 rounded hover:bg-[#c99e35] transition-colors shadow-sm flex items-center gap-2 font-medium text-sm"
        >
          <Plus size={18} strokeWidth={2} /> Add Image
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Loading Images...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Header */}
              <thead className="bg-[#f8f9fc] border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">
                    IMAGE
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider">
                    IMAGE NAME
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-600 uppercase tracking-wider text-center">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {threeDotImages?.length > 0 ? (
                  threeDotImages.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      
                      {/* Image Column */}
                      <td className="px-8 py-4 whitespace-nowrap">
                        <img
                          src={item.imageUrl}
                          alt={item.imageName}
                          className="h-14 w-14 object-cover rounded shadow-sm border border-gray-100 bg-white"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </td>

                      {/* Title Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-800 font-medium text-[15px]">{item.imageName}</span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-[#3b82f6] hover:text-blue-700 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-[#ef4444] hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">
                      No images found. Click "Add Image" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={pagination.currentPage === 1 || loading}
            onClick={() => fetchThreeDotImages(pagination.currentPage - 1)}
            className="border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 px-4 py-1.5 rounded font-medium transition-colors shadow-sm text-sm"
          >
            Prev
          </button>
          <span className="font-medium text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage === pagination.totalPages || loading}
            onClick={() => fetchThreeDotImages(pagination.currentPage + 1)}
            className="border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-50 px-4 py-1.5 rounded font-medium transition-colors shadow-sm text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* CREATE/UPDATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-[#1e293b]">
              {editId ? "Edit Image" : "Add New Image"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Image Name
                </label>
                <input
                  type="text"
                  name="imageName"
                  placeholder="e.g. Featured Product"
                  value={formData.imageName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#dcae3d] focus:ring-1 focus:ring-[#dcae3d] transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:border-[#dcae3d] focus:ring-1 focus:ring-[#dcae3d] transition-all text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#dcae3d] text-white px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#c99e35] transition-colors shadow-sm disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Save Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDotImage;