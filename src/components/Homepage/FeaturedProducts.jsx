import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your hooks
import { useWebProducts } from '../../Hook/useWebProducts'; 
import { useGoldCategories } from '../../Hook/useGoldCategories'; 

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  
  const { webProducts, products, loading: productsLoading, fetchAllProducts } = useWebProducts();
  const { goldCategories = [], loading: categoriesLoading, fetchGoldCategories } = useGoldCategories();

  const actualProducts = webProducts || products || [];

  useEffect(() => {
    if (fetchAllProducts) fetchAllProducts(1, 50); 
    if (fetchGoldCategories) fetchGoldCategories(1, 50);
  }, [fetchAllProducts, fetchGoldCategories]);

  const uniqueCategories = [...new Set(goldCategories.map(cat => cat.name || cat.categoryName).filter(Boolean))];
  const dynamicTabs = ['All', ...uniqueCategories];

  const filteredProducts = actualProducts.filter(product => {
    if (activeTab === 'All') return true; 
    const productCategory = product?.category || ""; 
    return productCategory.toLowerCase().trim() === activeTab.toLowerCase().trim();
  });

  const isLoading = productsLoading || categoriesLoading;

  return (
    <section className="py-16 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* --- Section Header --- */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] bg-gray-300 w-16 md:w-32"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Featured Collections
          </h2>
          <div className="h-[1px] bg-gray-300 w-16 md:w-32"></div>
        </div>

        {/* --- Dynamic Category Tabs --- */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mt-4 flex-wrap">
          {dynamicTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-sm md:text-base transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Swiper Container --- */}
      <div className="relative pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[#d4af37]" size={40} />
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {filteredProducts.map((product) => (
              <SwiperSlide key={product._id}>
                <div className="flex flex-col group h-full">
                  
                  {/* --- Product Image Container --- */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-[#f9f9f9]">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }}
                    />
                    
                    {/* --- Quick View Overlay --- */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10 pointer-events-none group-hover:pointer-events-auto">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); 
                          
                          // THIS REDIRECTS THE USER TO THE DETAILS PAGE
                          navigate(`/product/${product._id}`); 
                        }} 
                        className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-white transition-all duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 z-20 cursor-pointer pointer-events-auto"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* --- Product Details --- */}
                  <div className="mt-4 flex flex-col px-1 flex-grow cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                    <p className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <h3 className="text-sm md:text-base text-gray-800 font-medium mb-1 hover:text-[#d4af37] transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm md:text-base font-bold text-gray-900">
                          {Number(product.totalPrice).toLocaleString('en-IN')}৳
                        </p>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={(e) => e.stopPropagation()} 
                        className="text-gray-400 hover:text-red-500 transition-colors pt-0.5 flex-shrink-0 z-10"
                      >
                        <Heart size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        
        {/* Empty State / No Data */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400 italic">
            No products found for this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;