import React, { useState } from 'react';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';

// Adjust the path to where your hook is located
import useTwoDotBanners from '../../../Hook/useTwoDotBanners'; 

const TwoDotImage = () => {
    const { 
        banners, 
        loading, 
        addBanner, 
        updateBanner, 
        deleteBanner 
    } = useTwoDotBanners();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    // Branch removed from state tracking
    const [formData, setFormData] = useState({ imageName: '', imageUrl: '' });

    // --- Modal Handlers ---
    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ 
                imageName: item.imageName || '', 
                imageUrl: item.imageUrl || ''
            });
        } else {
            setEditingItem(null);
            setFormData({ imageName: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ imageName: '', imageUrl: '' });
    };

    // --- Form Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const result = editingItem 
            ? await updateBanner(editingItem._id, formData)
            : await addBanner(formData);
        
        if (result.success) {
            handleCloseModal();
        } else {
            alert(`Error: ${result.error}`);
        }
        setSubmitting(false);
    };

    // --- Delete Handler ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            const result = await deleteBanner(id);
            if (!result.success) {
                alert(`Error: ${result.error}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-[#1e293b]">
                        Manage Two Dot Images
                    </h1>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-[#dca43b] hover:bg-[#c99534] text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Add Image
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/30">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Image</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Image Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && banners.length === 0 ? (
                                    <tr>
                                        {/* Adjusted colSpan to 3 since Branch column is removed */}
                                        <td colSpan="3" className="py-12 text-center text-slate-500">
                                            <Loader2 className="animate-spin mx-auto mb-2 text-[#dca43b]" size={28} />
                                            Loading...
                                        </td>
                                    </tr>
                                ) : banners.length === 0 ? (
                                    <tr>
                                        {/* Adjusted colSpan to 3 */}
                                        <td colSpan="3" className="py-12 text-center text-slate-500">
                                            No images found.
                                        </td>
                                    </tr>
                                ) : (
                                    banners.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="h-14 w-14 border border-slate-200 rounded overflow-hidden bg-black flex items-center justify-center">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt={item.imageName} 
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-sm font-medium text-slate-700">
                                                {item.imageName}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex justify-end gap-4">
                                                    <button 
                                                        onClick={() => handleOpenModal(item)} 
                                                        className="text-blue-500 hover:text-blue-700 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} strokeWidth={2} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item._id)} 
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div 
                        className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit} className="p-8">
                            <h3 className="text-xl font-bold text-[#1e293b] mb-6">
                                {editingItem ? 'Edit Image' : 'Add New Image'}
                            </h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Featured Product"
                                        className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-[#dca43b] focus:ring-1 focus:ring-[#dca43b] transition-all"
                                        value={formData.imageName}
                                        onChange={(e) => setFormData({...formData, imageName: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                                    <input 
                                        type="url" 
                                        required 
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-[#dca43b] focus:ring-1 focus:ring-[#dca43b] transition-all"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8">
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal} 
                                    className="px-5 py-2 bg-slate-100 text-slate-700 font-medium rounded hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting} 
                                    className="px-5 py-2 bg-[#dca43b] hover:bg-[#c99534] text-white font-medium rounded transition-colors text-sm flex items-center gap-2 disabled:opacity-70"
                                >
                                    {submitting && <Loader2 size={16} className="animate-spin" />}
                                    {submitting ? 'Saving...' : 'Save Image'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TwoDotImage;