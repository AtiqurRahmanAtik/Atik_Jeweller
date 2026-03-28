import React, { useState, useEffect } from 'react';
import { Heart, SlidersHorizontal, LayoutList, LayoutGrid, Grid2X2, Grid3X3, ChevronDown } from 'lucide-react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import { useGoldCategories } from '../../Hook/useGoldCategories';
import { useGoldProducts } from '../../Hook/useGoldProducts';

const SHOW_LIMIT = 8;

const Shop = () => {
  const navigate = useNavigate();
  // Grab the dynamic ID from the URL
  const { id } = useParams();
  
  const { goldCategories, fetchAllGoldCategories, loading: catLoading } = useGoldCategories();
  const { goldProducts, fetchGoldProducts, loading: prodLoading } = useGoldProducts();

  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // ADDED: State for dynamic maximum price
  const [maxPrice, setMaxPrice] = useState(2850000);
  const [priceRange, setPriceRange] = useState(2850000);
  
  const [sortBy, setSortBy] = useState('default');
  const [gridView, setGridView] = useState('3');
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    fetchAllGoldCategories(1, 100);
  }, [fetchAllGoldCategories]);

  useEffect(() => {
    fetchGoldProducts(1, 100);
  }, [fetchGoldProducts]);

  // ADDED: Calculate the max purchasePrice when goldProducts load
  useEffect(() => {
    if (goldProducts && goldProducts.length > 0) {
      const highestPrice = Math.max(...goldProducts.map((p) => p.purchasePrice || 0));
      // Fallback to a default if purchasePrice is missing, otherwise use the highest found
      const finalMaxPrice = highestPrice > 0 ? highestPrice : 2850000;
      
      setMaxPrice(finalMaxPrice);
      setPriceRange(finalMaxPrice); // Set the slider thumb to the max by default
    }
  }, [goldProducts]);

  const toggleWishlist = (prodId) => {
    setWishlist((prev) =>
      prev.includes(prodId) ? prev.filter((i) => i !== prodId) : [...prev, prodId]
    );
  };

  const visibleCategories = showAllCategories ? goldCategories : goldCategories.slice(0, SHOW_LIMIT);

  const filteredProducts = goldProducts
    .filter((p) => !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase())
    .filter((p) => p.salesPrice <= priceRange);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.salesPrice - b.salesPrice;
    if (sortBy === 'price-desc') return b.salesPrice - a.salesPrice;
    if (sortBy === 'name') return a.productName.localeCompare(b.productName);
    return 0;
  });

  const gridClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">

        {/* ---- Sidebar ---- */}
        <aside className="w-full lg:w-[240px] shrink-0">

          {/* Categories */}
          <div className="mb-8">
            <button
              onClick={() => setCategoryOpen((prev) => !prev)}
              onMouseEnter={() => setCategoryOpen(true)}
              className="flex items-center justify-between w-full mb-4 group"
            >
              <h3 className="text-[15px] font-bold text-gray-900 tracking-wide">Categories</h3>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${categoryOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {categoryOpen && (
              <ul className="flex flex-col gap-1">
                {catLoading ? (
                  <li className="text-[13px] text-gray-400 py-1">Loading...</li>
                ) : (
                  <>
                    {visibleCategories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          onClick={() => setSelectedCategory(cat.categoryName === selectedCategory ? null : cat.categoryName)}
                          className={`text-[14px] text-left w-full py-[3px] transition-colors ${
                            selectedCategory === cat.categoryName
                              ? 'text-black font-semibold'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {cat.categoryName}
                        </button>
                      </li>
                    ))}
                    {goldCategories.length > SHOW_LIMIT && (
                      <button
                        onClick={() => setShowAllCategories((p) => !p)}
                        className="mt-3 text-[13px] font-semibold text-gray-800 hover:text-black transition-colors text-left"
                      >
                        {showAllCategories ? '− Show less' : '+ Show more'}
                      </button>
                    )}
                  </>
                )}
              </ul>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8" />

          {/* Pricing Filter */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-gray-900 tracking-wide">Pricing Filter</h3>
              <SlidersHorizontal size={15} className="text-gray-400" />
            </div>
            <input
              type="range"
              min={0}
              max={maxPrice} // MODIFIED: Now uses dynamic maxPrice
              step={1000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-black text-white text-[13px] font-semibold px-5 py-2 hover:bg-gray-800 transition-colors"
              >
                Filter
              </button>
              <span className="text-[13px] text-gray-600">
                Price: 0৳ — {priceRange.toLocaleString()}৳
              </span>
            </div>
          </div>

        </aside>

        {/* ---- Main Content ---- */}
        <main className="flex-1 min-w-0">
          
          {/* THE MAGIC HAPPENS HERE */}
          {id ? (
            // If URL has an ID (e.g., /shop/123), show the child component
            <Outlet />
          ) : (
            // If URL is just /shop, show the grid
            <>
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-[14px] text-gray-500">
                  1–{sortedProducts.length} Products of {sortedProducts.length} Products
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-500 hidden sm:block">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 text-[13px] px-3 py-1.5 focus:outline-none focus:border-gray-500 bg-white cursor-pointer"
                    >
                      <option value="default">Default sorting</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name A–Z</option>
                    </select>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    {[
                      { val: '1', Icon: LayoutList },
                      { val: '2', Icon: LayoutGrid },
                      { val: '3', Icon: Grid2X2 },
                      { val: '4', Icon: Grid3X3 },
                    ].map(({ val, Icon }) => (
                      <button
                        key={val}
                        onClick={() => setGridView(val)}
                        className={`p-1.5 transition-colors ${
                          gridView === val ? 'text-black' : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        <Icon size={18} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {prodLoading ? (
                <div className={`grid ${gridClass[gridView]} gap-4 md:gap-6`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-100 mb-3" />
                      <div className="h-3 bg-gray-100 rounded mb-2 w-1/3" />
                      <div className="h-4 bg-gray-100 rounded mb-2 w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-400 text-[15px]">
                  No products found.
                </div>
              ) : (
                <div className={`grid ${gridClass[gridView]} gap-4 md:gap-6`}>
                  {sortedProducts?.map((product) => (
                    <div
                      key={product._id}
                      className="group relative cursor-pointer"
                      onClick={() => navigate(`/shop/${product._id}`)} // Note: You might need to change this to `/product/${product._id}` based on your App.js router setup
                    >
                      <div className="relative overflow-hidden bg-gray-50 aspect-square">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/400x400/f5e6c8/b8860b?text=Gold';
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product._id);
                          }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <Heart
                            size={20}
                            strokeWidth={1.5}
                            className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                          />
                        </button>
                      </div>
                      <div className="pt-3 pb-1">
                        <p className="text-[11px] text-gray-400 tracking-widest uppercase mb-1">
                          {product.category}
                        </p>
                        <p className="text-[14px] text-gray-800 font-medium leading-snug mb-1 line-clamp-2">
                          {product.productName}
                        </p>
                        <p className="text-[15px] font-bold text-gray-900">
                          {product.salesPrice?.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default Shop;