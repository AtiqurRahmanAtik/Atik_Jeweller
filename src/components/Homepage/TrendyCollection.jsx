import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';
import { Heart } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const TrendyCollection = () => {
  // Mock data based on the provided image
  const products = [
    {
      id: 1,
      category: 'CHAIN',
      name: 'chain 001',
      price: '1,630,035.00৳',
      // Replace with your actual image path
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      category: 'BANGLE',
      name: 'Bangles 001',
      price: '845,958.53৳',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      category: 'SHITAHAR',
      name: 'Shitahar 003',
      price: '343,077.91৳',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      category: 'CHURI',
      name: 'Churi 001',
      price: '1,115,536.68৳',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5, // Extra item to demonstrate the slider functionality
      category: 'RING',
      name: 'Gold Ring 005',
      price: '125,500.00৳',
      image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <section className="py-16 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* --- Section Header --- */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-[1px] bg-gray-300 w-12 md:w-24"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Trendy Collection
          </h2>
          <div className="h-[1px] bg-gray-300 w-12 md:w-24"></div>
        </div>
        <p className="text-gray-500 text-sm md:text-base">
          Collect your loves with our newest arrivals.
        </p>
      </div>

      {/* --- Swiper Slider --- */}
      <div className="relative pb-12"> {/* pb-12 gives room for the pagination dots */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          // Responsive breakpoints for grid layout
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="flex flex-col group cursor-pointer">
                
                {/* --- Product Image Container --- */}
                <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay with View Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-white transition-colors duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* --- Product Details --- */}
                <div className="mt-4 flex justify-between items-start px-1">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest mb-1.5">
                      {product.category}
                    </p>
                    <h3 className="text-sm md:text-base text-gray-800 font-medium mb-2 hover:text-[#d4af37] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm md:text-base font-bold text-gray-900">
                      {product.price}
                    </p>
                  </div>
                  
                  {/* Heart Icon */}
                  <button className="text-gray-400 hover:text-red-500 transition-colors pt-1">
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

export default TrendyCollection;