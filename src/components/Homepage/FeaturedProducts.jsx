import  { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Pagination, Autoplay } from 'swiper/modules';
import { Heart } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const FeaturedProducts = () => {
  
  const [activeTab, setActiveTab] = useState('New Arrivals');

  const tabs = ['New Arrivals', 'Featured', 'Best Seller'];

  
  const products = [
    {
      id: 1,
      category: 'NECKLACE & EARRING SET',
      name: '22K Gold Necklace & Earring Set 010',
      price: '730,845.76৳',
      
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      category: 'NECKLACE & EARRING SET',
      name: '22K Gold Necklace & Earring Set 009',
      price: '408,399.19৳',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      category: 'NECKLACE & EARRING SET',
      name: '22K Gold Necklace & Earring Set 008',
      price: '481,185.67৳',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      category: 'NECKLACE & EARRING SET',
      name: '22K Gold Necklace & Earring Set 007',
      price: '578,813.94৳',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5, 
      category: 'NECKLACE & EARRING SET',
      name: '22K Gold Necklace & Earring Set 006',
      price: '620,000.00৳',
      image: 'https://images.unsplash.com/photo-1605100804763-247f66126e28?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <section className="py-16 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
   
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] bg-gray-300 w-16 md:w-32"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Featured Products
          </h2>
          <div className="h-[1px] bg-gray-300 w-16 md:w-32"></div>
        </div>

        {/* --- Filtering Tabs --- */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-sm md:text-base transition-colors ${
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

      
      <div className="relative pb-12">
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
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-[#0f0f0f]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-white transition-colors duration-300 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* --- Product Details --- */}
                <div className="mt-4 flex flex-col px-1">
                  <p className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-widest mb-1">
                    {product.category}
                  </p>
                  
                  <div className="flex justify-between items-start">
                    <div className="pr-4">
                      <h3 className="text-sm md:text-base text-gray-800 font-medium mb-1 hover:text-[#d4af37] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm md:text-base font-bold text-gray-900">
                        {product.price}
                      </p>
                    </div>
                    
                    {/* Heart Icon on the right */}
                    <button className="text-gray-400 hover:text-red-500 transition-colors pt-0.5 flex-shrink-0">
                      <Heart size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default FeaturedProducts;