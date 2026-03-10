import React, { useState } from 'react';
import { Search, Plus, MoreVertical, LayoutGrid, ChevronDown, Filter } from 'lucide-react';

const ProductList = () => {
  const categories = [
    { name: 'All', icon: '' },
    { name: 'Ear Rings', icon: '👂' },
    { name: 'Bracelet', icon: '💍' },
    { name: 'Nose pin', icon: '👃' },
    { name: 'Fingers Ring', icon: '👆' },
    { name: 'Necklace', icon: '📿' },
    { name: 'Raw Gold', icon: '🟡' },
  ];

  const products = [
    { id: 1, image: '🪙', name: 'Silver Bar 24k', code: '3000', metalType: 'SILVER', purity: '24k | 99.9', weight: '100 gm', stockType: 'Fine Stock' },
    { id: 2, image: '🏆', name: 'Gold bar 01 24k', code: '20000', metalType: 'GOLD', purity: '24k | 99.9', weight: '600 gm', stockType: 'Fine Stock' },
    { id: 3, image: '✨', name: 'dul', code: 'NOO', metalType: 'GOLD', purity: '21k | 87.5', weight: '1 gm', stockType: 'Customized Order' },
    { id: 4, image: '📿', name: 'Necklace Luxe', code: '6859', metalType: 'GOLD', purity: '22k | 91.6', weight: '40 gm', stockType: 'Fine Stock' },
    { id: 5, image: '💎', name: 'Diamond Studs', code: '3455', metalType: 'DIAMOND', purity: '18k | 75', weight: '5 gm', stockType: 'Wholesale' },
  ];

  const [activeCategory, setActiveCategory] = useState('All');

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
          <button 
            className="flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* --- Filter & Category Card --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by product name, SKU or code..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            
            {/* Dropdowns */}
            <div className="flex flex-wrap gap-3">
              {['Stock', 'Metal', 'Purity'].map((label) => (
                <div key={label} className="relative min-w-[140px] flex-1">
                  <select className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer">
                    <option value="">{label}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-primary" />
                </div>
              ))}
              <button className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="px-5 py-3 flex overflow-x-auto gap-2 hide-scrollbar bg-white">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.name 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="bg-primary text-white uppercase tracking-wider text-xs">
                <th className="px-6 py-4 font-bold">Sl No</th>
                <th className="px-6 py-4 font-bold text-left">Product</th>
                <th className="px-6 py-4 font-bold">Code</th>
                <th className="px-6 py-4 font-bold">Metal</th>
                <th className="px-6 py-4 font-bold">Purity</th>
                <th className="px-6 py-4 font-bold">Weight</th>
                <th className="px-6 py-4 font-bold">Stock Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`hover:brightness-95 transition-colors group ${index % 2 !== 0 ? 'bg-secondary' : 'bg-white'}`}
                >
                  <td className="px-6 py-4 text-gray-400 font-medium">{String(index + 1).padStart(2, '0')}</td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                        {product.image}
                      </div>
                      <span className="font-bold text-gray-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-primary">
                    #{product.code}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black text-gray-500">
                      {product.metalType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 italic">{product.purity}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{product.weight}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter bg-white border border-primary text-primary">
                      {product.stockType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-none hover:shadow-sm">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <p>Showing {products.length} products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100">Prev</button>
            <button className="px-3 py-1 bg-primary text-white rounded">1</button>
            <button className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100">Next</button>
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