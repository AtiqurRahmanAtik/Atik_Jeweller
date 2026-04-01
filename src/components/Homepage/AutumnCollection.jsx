// File: src/components/AutumnCollection/AutumnCollection.jsx
// (Adjust the import path to your hook depending on your folder structure)

import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your custom hook
import useAutumnCollections from '../../Hook/useAutumnCollections'; 

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const AutumnCollection = () => {
  const navigate = useNavigate();
  
  // Fetch data using the hook (fetching page 1, up to 15 items for the slider)
  const { autumnCollections, loading, error } = useAutumnCollections(1, 15);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
          <p className="text-gray-600 font-medium animate-pulse">Loading Autumn Collection...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg font-medium">
          Failed to load collection: {error}
        </div>
      </div>
    );
  }

  // Empty State
  if (!autumnCollections || autumnCollections.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        No autumn collections available at the moment.
      </div>
    );
  }

  return (
    <section className="py-16 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* --- Section Header --- */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-[1px] bg-gray-200 w-12 md:w-24"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Autumn Collection
          </h2>
          <div className="h-[1px] bg-gray-200 w-12 md:w-24"></div>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
          Collect your loves with our autumn arrivals.
        </p>
      </div>

      {/* --- Swiper Slider --- */}
      <div className="relative pb-12">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {autumnCollections.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="flex flex-col group cursor-pointer">
                
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.productTitle}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image' }}
                  />
                  
                  {/* Dark Overlay & Quick View Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-white transition-colors duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-4 flex justify-between items-start px-1">
                  <div className="flex-1 pr-2">
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1.5 line-clamp-1">
                      {product.category || 'Collection'}
                    </p>
                    <h3 className="text-sm md:text-base text-gray-800 font-medium mb-2 hover:text-[#d4af37] transition-colors line-clamp-1" title={product.productTitle}>
                      {product.productTitle}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-900">
                      {Number(product.totalPrice || product.originalPrice || 0).toLocaleString()}৳
                    </p>
                  </div>
                  
                  {/* Heart Icon */}
                  <button className="text-gray-400 hover:text-red-500 transition-colors pt-1 flex-shrink-0">
                    <Heart size={18} strokeWidth={1.5} />
                  </button>
                </div>
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default AutumnCollection;