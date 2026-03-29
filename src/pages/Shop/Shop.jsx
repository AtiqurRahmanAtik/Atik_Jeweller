import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, SlidersHorizontal, LayoutList, LayoutGrid,
  Grid2X2, Grid3X3, ChevronDown, ChevronRight, Home
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGoldCategories } from '../../Hook/useGoldCategories';
import { useGoldProducts } from '../../Hook/useGoldProducts';

const SHOW_LIMIT = 8;
const PRODUCTS_PER_PAGE = 12;

const Shop = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const { goldCategories, fetchAllGoldCategories, loading: catLoading } = useGoldCategories();
  const { goldProducts, fetchGoldProducts, loading: prodLoading } = useGoldProducts();

  const [wishlist, setWishlist]         = useState([]);
  const [showAllCats, setShowAllCats]   = useState(false);
  const [maxPrice, setMaxPrice]         = useState(2850000);
  const [priceRange, setPriceRange]     = useState(2850000);
  const [sortBy, setSortBy]             = useState('default');
  const [gridView, setGridView]         = useState('3');
  const [currentPage, setCurrentPage]   = useState(1);

  // Category accordion: open on hover OR click, close on mouse-leave
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [pricingOpen, setPricingOpen]   = useState(true);

  // ── Fetch on mount ──────────────────────────────
  useEffect(() => { fetchAllGoldCategories(1, 100); }, []); // eslint-disable-line
  useEffect(() => { fetchGoldProducts(1, 100); }, []);       // eslint-disable-line

  // ── Derive max price from products ─────────────
  useEffect(() => {
    if (goldProducts?.length > 0) {
      const highest = Math.max(...goldProducts.map(p => Number(p.salesPrice) || 0));
      const finalMax = highest > 0 ? highest : 2850000;
      setMaxPrice(finalMax);
      setPriceRange(finalMax);
    }
  }, [goldProducts]);

  // Reset page on filter/sort change
  useEffect(() => { setCurrentPage(1); }, [categoryName, sortBy, priceRange]);

  const toggleWishlist = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const activeCategory = categoryName || null;

  // ── Filter + sort ───────────────────────────────
  const filtered = (goldProducts || [])
    .filter(p => !activeCategory || p.category?.toLowerCase() === activeCategory.toLowerCase())
    .filter(p => (p.salesPrice || 0) <= priceRange);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.salesPrice - b.salesPrice;
    if (sortBy === 'price-desc') return b.salesPrice - a.salesPrice;
    if (sortBy === 'name')       return a.productName?.localeCompare(b.productName);
    return 0;
  });

  const totalProducts = sorted.length;
  const totalPages    = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const paginated     = sorted.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const startItem     = totalProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem       = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  const visibleCats = showAllCats ? goldCategories : goldCategories.slice(0, SHOW_LIMIT);

  const gridClass = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 lg:grid-cols-4',
  };

  const goPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-[#f5f5f5]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Hero ── */}
      <div className="bg-[#efefef] border-b border-gray-200 py-8 text-center">
        <h1 className="text-4xl font-light text-gray-800 mb-2 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
          Shop
        </h1>
        <nav className="flex items-center justify-center gap-1.5 text-[13px] text-gray-500">
          <Link to="/" className="hover:text-gray-800 transition-colors flex items-center gap-1">
            <Home size={11} /> Home
          </Link>
          <ChevronRight size={11} className="text-gray-400" />
          <span className="text-gray-700">Shop</span>
          {activeCategory && (
            <>
              <ChevronRight size={11} className="text-gray-400" />
              <span className="text-gray-700 capitalize">{activeCategory}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-7">

        {/* ════ SIDEBAR ════ */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-1">

          {/* Categories — hover OR click to open, mouse-leave to close */}
          <div
            className="bg-white border border-gray-200"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button
              onClick={() => setCategoryOpen(p => !p)}
              className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[14px] font-semibold text-gray-800 tracking-wide">Categories</span>
              <ChevronDown
                size={15}
                className={`text-gray-500 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {categoryOpen && (
              <div className="border-t border-gray-100 px-4 py-3">
                {catLoading ? (
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-3.5 bg-gray-100 rounded animate-pulse w-3/4" />
                    ))}
                  </div>
                ) : (
                  <>
                    <ul className="space-y-0">
                      {visibleCats.map(cat => (
                        <li key={cat._id}>
                          <button
                            onClick={() => {
                              if (activeCategory === cat.categoryName) {
                                navigate('/shop');
                              } else {
                                navigate(`/shop/product-category/${cat.categoryName}`);
                              }
                            }}
                            className={`text-[13.5px] text-left w-full py-1 transition-colors ${
                              activeCategory === cat.categoryName
                                ? 'text-black font-semibold'
                                : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            {cat.categoryName}
                          </button>
                        </li>
                      ))}
                    </ul>

                    {goldCategories.length > SHOW_LIMIT && (
                      <button
                        onClick={() => setShowAllCats(p => !p)}
                        className="mt-3 text-[13px] font-semibold text-gray-700 hover:text-black transition-colors"
                      >
                        {showAllCats ? '− Show less' : '+ Show more'}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Pricing Filter */}
          <div className="bg-white border border-gray-200">
            <button
              onClick={() => setPricingOpen(p => !p)}
              className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[14px] font-semibold text-gray-800 tracking-wide">Pricing Filter</span>
              <ChevronDown
                size={15}
                className={`text-gray-500 transition-transform duration-200 ${pricingOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {pricingOpen && (
              <div className="border-t border-gray-100 px-4 py-4">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full cursor-pointer mb-4"
                  style={{ accentColor: '#1a1a1a' }}
                />
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => { setPriceRange(maxPrice); navigate('/shop'); }}
                    className="bg-gray-900 text-white text-[12px] font-semibold px-5 py-2 hover:bg-gray-700 transition-colors"
                  >
                    Filter
                  </button>
                  <span className="text-[12px] text-gray-600">
                    Price: 0৳ — {priceRange.toLocaleString('en-BD')}৳
                  </span>
                </div>
              </div>
            )}
          </div>

        </aside>

        {/* ════ MAIN ════ */}
        <main className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <p className="text-[13px] text-gray-500">
              {prodLoading ? (
                <span className="inline-block w-44 h-4 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <span className="font-medium text-gray-700">{startItem}–{endItem}</span>
                  {' '}Products of{' '}
                  <span className="font-medium text-gray-700">{totalProducts}</span> Products
                  {activeCategory && (
                    <> in <span className="font-semibold text-gray-800 capitalize">{activeCategory}</span></>
                  )}
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-gray-500 hidden sm:block">Sort by</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 text-[12px] px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-gray-500 cursor-pointer"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              {/* Grid toggles */}
              <div className="hidden sm:flex items-center gap-0.5">
                {[
                  { val: '1', Icon: LayoutList },
                  { val: '2', Icon: LayoutGrid },
                  { val: '3', Icon: Grid2X2 },
                  { val: '4', Icon: Grid3X3 },
                ].map(({ val, Icon }) => (
                  <button
                    key={val}
                    onClick={() => setGridView(val)}
                    className={`p-1.5 border transition-colors ${
                      gridView === val
                        ? 'border-gray-400 text-gray-900'
                        : 'border-transparent text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          {prodLoading ? (
            <div className={`grid ${gridClass[gridView]} gap-4`}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white border border-gray-200">
              <SlidersHorizontal size={36} strokeWidth={1} className="mb-3 opacity-30" />
              <p className="text-[14px]">No products found.</p>
              {activeCategory && (
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-3 text-[12px] underline text-gray-500 hover:text-gray-800"
                >
                  Clear filter
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={`grid ${gridClass[gridView]} gap-4`}>
                {paginated.map(product => {
                  const safeId = product._id || product.id;
                  const isWished = wishlist.includes(safeId);

                  return (
                    <div key={safeId} className="group relative bg-white">
                      <Link to={`/shop/${safeId}`} className="block">
                      
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-square bg-gray-50">
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { e.target.src = 'https://placehold.co/400x400/f5e6c8/b8860b?text=Gold'; }}
                          />
                        </div>

                        {/* Info row */}
                        <div className="px-0 pt-2 pb-1 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-0.5">
                              {product.category}
                            </p>
                            <p className="text-[13px] text-gray-800 font-medium leading-snug mb-1 line-clamp-2 group-hover:text-[#b8860b] transition-colors">
                              {product.productName}
                            </p>
                            <p className="text-[14px] font-bold text-gray-900">
                              {product.salesPrice?.toLocaleString('en-BD', { minimumFractionDigits: 2 })}৳
                            </p>
                          </div>

                          {/* Heart — appears on hover */}
                          <button
                            onClick={e => toggleWishlist(e, safeId)}
                            className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Heart
                              size={18}
                              strokeWidth={1.5}
                              className={isWished ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-400'}
                            />
                          </button>
                        </div>

                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-10">
                  <button
                    onClick={() => goPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 text-[13px] text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >‹</button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 || page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goPage(page)}
                          className={`w-8 h-8 text-[13px] border transition-colors ${
                            currentPage === page
                              ? 'bg-gray-900 text-white border-gray-900 font-semibold'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900'
                          }`}
                        >{page}</button>
                      );
                    }
                    if (
                      (page === currentPage - 2 && page > 1) ||
                      (page === currentPage + 2 && page < totalPages)
                    ) {
                      return <span key={page} className="px-1 text-gray-400 text-[13px]">…</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => goPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 text-[13px] text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >›</button>
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