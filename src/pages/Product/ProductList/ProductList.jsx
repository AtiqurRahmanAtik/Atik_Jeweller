import React, { useEffect, useState } from 'react';
import { 
  Search, Plus, MoreVertical, LayoutGrid, 
  ChevronDown, Filter, Loader2, Image as ImageIcon 
} from 'lucide-react';
import { useGoldProducts } from "../../../Hook/useGoldProducts"; // Adjust path as needed
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();

  const { 
    goldProducts, pagination, loading, 
    categories, stocks, metals, purities,
    fetchGoldProducts, fetchFilters, deleteGoldProduct 
  } = useGoldProducts();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("");
  const [selectedPurity, setSelectedPurity] = useState("");


  // Fetch Data on Mount
  useEffect(() => {
    fetchGoldProducts(1, 10);
    fetchFilters(); // Load dynamic dropdown options
  }, [fetchGoldProducts, fetchFilters]);


  const handlePageChange = (page) => {
    fetchGoldProducts(page, 10);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await deleteGoldProduct(id);
      if (success) fetchGoldProducts(pagination.currentPage, 10);
    }
  };

  // Apply filters to the current page's products
  const filteredProducts = Array.isArray(goldProducts) ? goldProducts.filter((product) => {
    const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.productCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesStock = selectedStock === "" || product.stockTypes === selectedStock;
    const matchesMetal = selectedMetal === "" || product.metalType === selectedMetal;
    const matchesPurity = selectedPurity === "" || product.purity === selectedPurity;

    return matchesSearch && matchesCategory && matchesStock && matchesMetal && matchesPurity;
  }) : [];



  return (
    <div className="bg-secondary min-h-screen p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
          <p className="text-sm text-gray-500">Manage and track your inventory levels</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
            <LayoutGrid size={20} />
          </button>
          <Link to={'/product/add'}
            className="flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* --- Filter & Category Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by product name or code..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Dropdowns (Dynamically populated from backend) */}
            <div className="flex flex-wrap gap-3">
              
              <div className="relative min-w-[140px] flex-1">
                <select 
                  value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="">All Stocks</option>
                  {stocks?.map((stock) => (
                    <option key={stock._id} value={stock.stockType}>{stock.stockType}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-primary" />
              </div>

              <div className="relative min-w-[140px] flex-1">
                <select 
                  value={selectedMetal} onChange={(e) => setSelectedMetal(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="">All Metals</option>
                  {metals?.map((metal) => (
                    <option key={metal._id} value={metal.metalName}>{metal.metalName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-primary" />
              </div>

              <div className="relative min-w-[140px] flex-1">
                <select 
                  value={selectedPurity} onChange={(e) => setSelectedPurity(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="">All Purities</option>
                  {purities?.map((purity) => (
                    <option key={purity._id} value={purity.purityName}>{purity.purityName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-primary" />
              </div>

              <button className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-5 py-4 flex flex-wrap gap-3 bg-white items-center">
          
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'All' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.categoryName)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.categoryName 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {/* Optional: if your category has an image, render it */}
              {cat.categoryImage && (
                <img 
                  src={cat.categoryImage} 
                  alt="" 
                  className="w-4 h-4 rounded-full object-cover" 
                />
              )}
              {cat.categoryName}
            </button>
          ))}
          
        </div>
      </div>

      {/* --- Table Section --- */}-
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        )}

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-primary text-white uppercase tracking-wider text-[11px]">
                <th className="px-4 py-4 font-bold">Sl</th>
                <th className="px-4 py-4 font-bold text-left">Product</th>
                <th className="px-4 py-4 font-bold">Code</th>
                <th className="px-2 py-4 font-bold">Vori</th>
                <th className="px-2 py-4 font-bold">Ana</th>
                <th className="px-2 py-4 font-bold">Roti</th>
                <th className="px-2 py-4 font-bold">Point</th>
                <th className="px-4 py-4 font-bold">Metal</th>
                <th className="px-4 py-4 font-bold">Purity</th>
                <th className="px-4 py-4 font-bold">Stock Status</th>
                <th className="px-4 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr 
                    key={product._id} 
                    className={`hover:brightness-95 transition-colors group ${index % 2 !== 0 ? 'bg-secondary' : 'bg-white'}`}
                  >
                    <td className="px-4 py-4 text-gray-400 font-medium">
                      {String((pagination.currentPage - 1) * 10 + index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                          {product.productImage ? (
                            <img src={product.productImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-gray-300" size={18} />
                          )}
                        </div>
                        <span className="font-bold text-gray-700">{product.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-primary">#{product.productCode}</td>
                    <td className="px-2 py-4 font-semibold">{product.vori || 0}</td>
                    <td className="px-2 py-4 font-semibold">{product.ana || 0}</td>
                    <td className="px-2 py-4 font-semibold">{product.roti || 0}</td>
                    <td className="px-2 py-4 font-semibold">{product.point || 0}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black text-gray-500 uppercase">
                        {product.metalType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 italic">{product.purity}</td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-white border border-primary text-primary">
                        {product.stockTypes}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="11" className="py-20 text-gray-400 italic">
                      No products match your filters.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- Pagination --- */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <p>Showing {filteredProducts.length} of {pagination.totalItems} products</p>
          <div className="flex gap-2">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded">{pagination.currentPage}</button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ProductList;