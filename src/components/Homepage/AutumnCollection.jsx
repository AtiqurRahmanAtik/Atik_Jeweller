import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';
import { Heart } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const AutumnCollection = () => {
  
  const products = [
    {
      id: 1,
      category: 'SHITAHAR',
      name: 'Shitahar 008',
      price: '515,467.35৳',
    
      image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      category: 'SHITAHAR',
      name: 'Shitahar 007',
      price: '554,220.56৳',
     
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      category: 'SHITAHAR',
      name: 'Shitahar 006',
      price: '553,972.14৳',
     
      image: 'https://images.unsplash.com/photo-1629224314594-2b131d278d1a?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      category: 'SHITAHAR',
      name: 'Shitahar 005',
      price: '650,591.42৳',
      
      image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5, 
      category: 'SHITAHAR',
      name: 'Shitahar 004',
      price: '480,000.00৳',
    
      image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?auto=format&fit=crop&q=80&w=400',
    },
  ];

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
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="flex flex-col group cursor-pointer">
                
                
                <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  
                  {/* Dark Overlay & Quick View Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-white transition-colors duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0">
                      Quick View
                    </button>
                  </div>
                </div>

               
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

export default AutumnCollection;