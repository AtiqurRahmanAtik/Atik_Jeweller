import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useWebProducts } from '../../../Hook/useWebProducts'; // Adjust path
import { useGoldCategories } from '../../../Hook/useGoldCategories'; // Add this import

const initialFormState = {
  imageName: '',
  imageUrl: '',
  title: '',
  originalPrice: '',
  wages: '',
  totalPrice: 0,
  quantity: '',
  delivery: '',
  category: '', // Starts empty, will force user to select from dropdown
  tag: '',
  weight: ''
};

const Products = () => {
  // Web Products Hook
  const { 
    webProducts, loading: productsLoading, pagination, 
    fetchWebProducts, createWebProduct, updateWebProduct, deleteWebProduct 
  } = useWebProducts();

  // Gold Categories Hook
  const { 
    goldCategories, 
    loading: categoriesLoading, 
    fetchGoldCategories 
  } = useGoldCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  // Initial Fetch for both Products and Categories
  useEffect(() => {
    fetchWebProducts(1, 10);
    fetchGoldCategories(1, 100); // Fetch a high limit to get all categories for the dropdown
  }, [fetchWebProducts, fetchGoldCategories]);

  // Auto-calculate Total Price based on Original Price + Wages
  useEffect(() => {
    const p = parseFloat(formData.originalPrice) || 0;
    const w = parseFloat(formData.wages) || 0;
    setFormData(prev => ({ ...prev, totalPrice: p + w }));
  }, [formData.originalPrice, formData.wages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditId(product._id);
      setIsEditing(true);
    } else {
      setFormData(initialFormState);
      setIsEditing(false);
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isEditing 
      ? await updateWebProduct(editId, formData) 
      : await createWebProduct(formData);

    if (success) setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteWebProduct(id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Web Products</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#d4af37] hover:bg-yellow-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th className="py-4 px-6 text-center">Image</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Qty</th>
                <th className="py-4 px-6 text-right">Price (৳)</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {productsLoading && webProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-[#d4af37]" size={32} />
                  </td>
                </tr>
              ) : webProducts.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 italic text-gray-400">No products found.</td></tr>
              ) : (
                webProducts.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100  transition">
                    <td className="py-3 px-6 text-center flex justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt="" className="w-12 h-12 rounded object-cover border" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center"><ImageIcon size={20} className="text-gray-400"/></div>
                      )}
                    </td>
                    <td className="py-3 px-6 font-medium text-gray-900">{product.title}</td>
                    <td className="py-3 px-6">
                      <span className="text-black bg-white px-2 py-1 rounded text-xs">{product.category}</span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right font-bold text-[#d4af37]">
                      {Number(product.totalPrice).toLocaleString()}৳
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center gap-3">
                        <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:text-blue-700 transition">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Controls --- */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <span className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.totalItems})
          </span>
          <div className="flex gap-2">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => fetchWebProducts(pagination.currentPage - 1)}
              className="px-3 py-1 border bg-white rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
              onClick={() => fetchWebProducts(pagination.currentPage + 1)}
              className="px-3 py-1 border bg-white rounded disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* --- DYNAMIC CATEGORY DROPDOWN --- */}
                   <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
  <select 
    required 
    name="category" 
    value={formData.category} 
    onChange={handleChange} 
    // ADDED text-black here to force the selected value to be black
    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none bg-white text-black"
  >
    <option value="" disabled className="text-gray-500">
      Select Category
    </option>
    
    {categoriesLoading ? (
      <option disabled className="text-black">Loading categories...</option>
    ) : (
      goldCategories?.map((cat) => (
        // Added text-black to options and a fallback for the category name property
        <option 
          key={cat._id} 
          value={cat.name || cat.categoryName} 
          className="text-black"
        >
          {cat.name || cat.categoryName}
        </option>
      ))
    )}
  </select>
</div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Tag *</label>
                      <input required type="text" name="tag" value={formData.tag} onChange={handleChange} placeholder="e.g. New Arrivals" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity *</label>
                      <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Weight (Gram) *</label>
                      <input required type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Info *</label>
                    <input required type="text" name="delivery" value={formData.delivery} onChange={handleChange} placeholder="e.g. 3-5 Business Days" className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-lg border">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image Name *</label>
                    <input required type="text" name="imageName" value={formData.imageName} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL *</label>
                    <input required type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none bg-white" />
                  </div>
                  <hr className="my-4 border-gray-200"/>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price *</label>
                      <input required type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Wages *</label>
                      <input required type="number" name="wages" value={formData.wages} onChange={handleChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#d4af37] outline-none bg-white" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Price (Auto-Calculated)</label>
                    <div className="w-full p-3 border rounded bg-gray-200 text-gray-800 font-bold text-lg">
                      ৳{formData.totalPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={productsLoading} className="px-8 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2 transition">
                  {productsLoading && <Loader2 size={16} className="animate-spin" />}
                  {isEditing ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;