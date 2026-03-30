// File: src/pages/TrendyCollection/TrendyCollection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTrendyCollections from '../../Hook/useTrendyCollections';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendyCollection = () => {
  const navigate = useNavigate();
  const { trendyCollections, loading, error } = useTrendyCollections(1, 15);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
          <p className="text-primary font-semibold animate-pulse">Loading Trendy Collections...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg font-medium shadow-sm">
          Oops! Failed to load collections: {error}
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (!trendyCollections || trendyCollections.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        No trendy collections available at the moment.
      </div>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl">

        {/* ── Section Header ── */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 relative inline-block">
            Trendy Collections
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-secondary rounded-full" />
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover our most popular and exclusive pieces, handpicked just for you.
          </p>
        </div>

        {/* ── Swiper ── */}
        <div className="relative px-2 md:px-6">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={trendyCollections.length > 4}
            breakpoints={{
              640:  { slidesPerView: 2 },
              768:  { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-14"
          >
            {trendyCollections.map((product) => (
              <SwiperSlide key={product._id} className="h-auto">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300
                                border border-gray-100 flex flex-col h-full group overflow-hidden">

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.imageUrl}
                      alt={product.productTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://placehold.co/300x300/e5e7eb/9ca3af?text=No+Image'; }}
                    />

                    {/* Category badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1
                                      rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                        {product.category}
                      </div>
                    )}

                    {/* Hover overlay — clicking navigates to details page */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4
                                    group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                                    bg-gradient-to-t from-black/60 to-transparent">
                      <button
                        onClick={() => navigate(`/trendy-collection/${product._id}`)}
                        className="w-full bg-primary hover:bg-white hover:text-primary text-white
                                   font-bold py-2.5 rounded-lg shadow-md transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3
                      className="text-lg font-bold text-primary mb-1 line-clamp-1 cursor-pointer hover:underline"
                      title={product.productTitle}
                      onClick={() => navigate(`/trendy-collection/${product._id}`)}
                    >
                      {product.productTitle}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3" title={product.productName}>
                      {product.productName}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      {/* Price */}
                      <div className="flex flex-col">
                        {product.originalPrice && Number(product.originalPrice) > Number(product.totalPrice) && (
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {Number(product.originalPrice).toLocaleString()}৳
                          </span>
                        )}
                        <span className="text-xl font-black text-primary">
                          {Number(product.totalPrice || product.originalPrice).toLocaleString()}৳
                        </span>
                      </div>

                      {/* Delivery */}
                      {product.estimatedDelivery && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0.5">
                            Delivery
                          </span>
                          <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded">
                            {product.estimatedDelivery}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Swiper nav / pagination custom styles */}
      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: var(--primary, #0a2342) !important;
          background-color: white;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,.1);
          transition: all .3s ease;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px !important;
          font-weight: bold;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: var(--secondary, #d4af37);
          color: white !important;
        }
        .swiper-pagination-bullet-active {
          background-color: var(--secondary, #d4af37) !important;
        }
      `}</style>
    </section>
  );
};

export default TrendyCollection;