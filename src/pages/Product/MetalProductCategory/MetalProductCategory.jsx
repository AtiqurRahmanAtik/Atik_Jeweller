import React, { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, Loader2, 
  X, LayoutGrid, ChevronLeft, ChevronRight, Image as ImageIcon 
} from 'lucide-react';
import { useGoldCategories } from '../../../Hook/useGoldCategories'; 

const MetalProductCategory = () => {
  const { 
    goldCategories, loading, pagination, 
    fetchGoldCategories, createGoldCategory, 
    updateGoldCategory, deleteGoldCategory 
  } = useGoldCategories();

  // State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ 
    categoryName: '', 
    categoryImage: '' 
  });

  useEffect(() => {
    fetchGoldCategories(1, 10);
  }, [fetchGoldCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateGoldCategory(editingId, formData);
      } else {
        await createGoldCategory(formData);
      }
      closeModal();
      fetchGoldCategories(pagination.currentPage || 1, 10);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ 
      categoryName: category.categoryName, 
      categoryImage: category.categoryImage || '' 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await deleteGoldCategory(id);
      if (success) fetchGoldCategories(pagination.currentPage || 1, 10);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ categoryName: '', categoryImage: '' });
  };

  const filteredCategories = goldCategories?.filter(cat => 
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Product Categories</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and organize your jewelry categories</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-lg hover:bg-secondary transition-all shadow-sm">
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20 hover:brightness-110"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* --- Search/Filter Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-5">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by category name..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-primary text-white uppercase tracking-widest text-[11px]">
                <th className="px-6 py-5 font-bold w-20 border-r border-white/10">Sl</th>
                <th className="px-6 py-5 font-bold text-left border-r border-white/10">Category Name</th>
                <th className="px-6 py-5 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
              {filteredCategories?.length > 0 ? (
                filteredCategories.map((cat, index) => (
                  <tr key={cat._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-gray-400">
                      {String(((pagination.currentPage || 1) - 1) * 10 + index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-4">
                        {/* Image Render */}
                        <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                          {cat.categoryImage && cat.categoryImage !== 'none' ? (
                            <img src={cat.categoryImage} alt={cat.categoryName} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={20} />
                          )}
                        </div>
                        <span className="font-bold text-gray-800 text-base">{cat.categoryName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-primary hover:bg-secondary rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="3" className="py-24 text-gray-400 italic font-normal">No categories available.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <p>Showing {filteredCategories?.length || 0} items</p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => fetchGoldCategories(pagination.currentPage - 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-secondary disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-1.5 bg-primary text-white rounded-lg shadow-sm font-bold flex items-center justify-center">
              {pagination.currentPage || 1}
            </span>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => fetchGoldCategories(pagination.currentPage + 1)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-secondary disabled:opacity-50 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-[110] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-primary p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Plus size={20} />
                </div>
                <h3 className="font-bold text-lg">{editingId ? 'Edit Category' : 'New Category'}</h3>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Category Name Input */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Category Name
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition-all"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  placeholder="Enter Category Name"
                />
              </div>

              {/* Category Image Input */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Category Image URL
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 transition-all"
                  value={formData.categoryImage}
                  onChange={(e) => setFormData({ ...formData, categoryImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Image Preview Box */}
              {formData.categoryImage && formData.categoryImage !== 'none' && (
                <div className="flex flex-col items-center justify-center pt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preview</p>
                  <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 overflow-hidden shadow-sm bg-secondary">
                    <img 
                      src={formData.categoryImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  editingId ? 'Update Category' : 'Create Category'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetalProductCategory;