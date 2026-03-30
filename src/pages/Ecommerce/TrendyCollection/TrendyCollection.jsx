// File: src/pages/TrendyCollection/TrendyCollection.jsx

import React, { useState, useEffect } from 'react';
import useTrendyCollections from '../../../Hook/useTrendyCollections'; // Default export
import { useWebProducts } from '../../../Hook/useWebProducts'; // Named export

// Icons (assuming you are using lucide-react or similar based on the image style)
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'; 

const initialFormState = {
    productName: '',
    imageUrl: '',
    productTitle: '',
    originalPrice: '',
    wages: '',
    totalPrice: '',
    quantity: '',
    estimatedDelivery: '',
    category: '',
    weight: ''
};

const TrendyCollection = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Form & Modal States
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);

    // 1. Fetch Trendy Collections
    const { 
        trendyCollections, 
        pagination, 
        loading: collectionsLoading, 
        error: collectionsError,
        addCollection,
        updateCollection,
        deleteCollection
    } = useTrendyCollections(currentPage, itemsPerPage);

    // 2. Fetch Web Products (for the Category Dropdown)
    const { 
        webProducts, 
        fetchAllProducts, 
        loading: productsLoading 
    } = useWebProducts();

    // Fetch web products when component mounts to populate the dropdown
    useEffect(() => {
        fetchAllProducts(1, 100); // Fetching top 100 products to extract categories
    }, [fetchAllProducts]);

    // Extract unique categories from webProducts to avoid duplicates in the dropdown
    const uniqueCategories = Array.from(
        new Set(webProducts.map(product => product.category || product.productName).filter(Boolean))
    );

    // Handle Form Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Close Modal Helper
    const closeModal = () => {
        setShowModal(false);
        setFormData(initialFormState);
        setEditingId(null);
    };

    // Handle Form Submit (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        
        if (editingId) {
            result = await updateCollection(editingId, formData);
        } else {
            result = await addCollection(formData);
        }

        if (result.success) {
            closeModal();
        } else {
            alert(result.error || "An error occurred while saving.");
        }
    };

    // Handle Edit Button Click
    const handleEdit = (product) => {
        setFormData({
            productName: product.productName || '',
            imageUrl: product.imageUrl || '',
            productTitle: product.productTitle || '',
            originalPrice: product.originalPrice || '',
            wages: product.wages || '',
            totalPrice: product.totalPrice || '',
            quantity: product.quantity || '',
            estimatedDelivery: product.estimatedDelivery || '',
            category: product.category || '',
            weight: product.weight || ''
        });
        setEditingId(product._id);
        setShowModal(true);
    };

    // Handle Delete Button Click
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const result = await deleteCollection(id);
            if (!result.success) {
                alert(result.error);
            }
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        if (!pagination) return [];
        const pages = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Loading State
    if (collectionsLoading && trendyCollections.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl font-semibold text-primary animate-pulse">
                    Loading Products...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            
            {/* --- Header Section --- */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-primary">Manage Web Products</h1>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white bg-primary hover:bg-opacity-90 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Error Message */}
            {collectionsError && (
                <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg mb-6 text-center font-medium shadow-sm">
                    {collectionsError}
                </div>
            )}

            {/* --- Product Table --- */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                                <th className="px-6 py-4 font-bold">IMAGE</th>
                                <th className="px-6 py-4 font-bold">TITLE</th>
                                <th className="px-6 py-4 font-bold">CATEGORY</th>
                                <th className="px-6 py-4 font-bold">QTY</th>
                                <th className="px-6 py-4 font-bold">PRICE (৳)</th>
                                <th className="px-6 py-4 font-bold">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {trendyCollections.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                trendyCollections.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-12 w-12 rounded overflow-hidden border border-gray-200">
                                                <img 
                                                    src={product.imageUrl} 
                                                    alt={product.productTitle} 
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-primary text-sm">{product.productTitle}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-primary">{product.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-sm bg-green-100 text-green-800">
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-primary text-sm">
                                                {Number(product.totalPrice || product.originalPrice).toLocaleString()}৳
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete"
                                                >
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
            </div>

            {/* --- Pagination Controls --- */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">
                        Showing page <span className="font-bold text-primary">{pagination.currentPage}</span> of <span className="font-bold text-primary">{pagination.totalPages}</span>
                    </span>
                    
                    <div className="flex items-center space-x-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        {/* Numbered Pagination Buttons */}
                        {getPageNumbers().map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-1 rounded-md border text-sm font-medium transition-colors ${
                                    currentPage === number
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            className="p-1 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}


            {/* --- Create / Update Form Modal --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border-t-4 border-primary">
                        
                        {/* Close Button */}
                        <button 
                            onClick={closeModal} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold leading-none transition-colors"
                        >
                            &times;
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-3">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Product Title</label>
                                <input type="text" name="productTitle" value={formData.productTitle} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" placeholder="https://..." />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none bg-white"
                                    disabled={productsLoading}
                                >
                                    <option value="" disabled>
                                        {productsLoading ? "Loading Categories..." : "Select a Category"}
                                    </option>
                                    {uniqueCategories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Original Price (৳)</label>
                                <input type="text" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Total Price (৳)</label>
                                <input type="text" name="totalPrice" value={formData.totalPrice} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Wages (৳)</label>
                                <input type="text" name="wages" value={formData.wages} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Weight (g)</label>
                                <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" />
                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">Estimated Delivery</label>
                                <input type="text" name="estimatedDelivery" value={formData.estimatedDelivery} onChange={handleInputChange} required className="border border-gray-300 p-2 rounded focus:ring-1 focus:ring-secondary focus:border-secondary outline-none" placeholder="E.g., 3-5 Business Days" />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 rounded font-medium text-white bg-primary hover:bg-opacity-90 transition-colors shadow-sm hover:shadow"
                                >
                                    {editingId ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrendyCollection;