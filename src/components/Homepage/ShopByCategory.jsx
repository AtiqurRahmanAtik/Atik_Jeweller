import React, { useEffect, useState } from 'react';
import { useGoldCategories } from '../../Hook/useGoldCategories'; // Ensure this path matches your folder structure
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import basic Swiper styles only
import 'swiper/css';

const ShopByCategory = () => {
  const { goldCategories, loading, fetchAllGoldCategories } = useGoldCategories();
  
  // State to hold the swiper instance for custom Tailwind navigation buttons
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    // Fetch a large limit (e.g., 50) to ensure all categories load into the slider
    fetchAllGoldCategories(1, 50);
  }, [fetchAllGoldCategories]);

  return (
    <section className="py-20 bg-gradient-to-b from-[#faf9f6] to-white overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Section Title with Decorative Line */}
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-5xl font-serif text-[#1a1a1a] mb-4 tracking-wide">
            Shop By Category
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-[#d4af37]/40"></div>
            <div className="w-2 h-2 rounded-full bg-[#d4af37] transform rotate-45"></div>
            <div className="h-[1px] w-16 bg-[#d4af37]/40"></div>
          </div>
          <p className="mt-4 text-gray-500 text-sm md:text-base font-light tracking-wider uppercase">
            Discover Our Exquisite Collections
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div key={skeleton} className="flex flex-col items-center animate-pulse">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gray-200 shadow-inner"></div>
                <div className="h-4 w-24 bg-gray-200 mt-6 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Swiper Carousel for Categories with Custom Tailwind Navigation */
          <div className="relative px-2 md:px-12">
            
            {/* Custom Previous Button */}
            <button 
              onClick={() => swiperInstance?.slidePrev()}
              className="absolute left-0 top-[40%] -translate-y-1/2 z-10 hidden md:flex w-11 h-11 items-center justify-center rounded-full bg-primary border border-gray-200 text-white shadow-md hover:bg-primary hover:border-[#d4af37] hover:text-white hover:scale-105 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition-all duration-300"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            <Swiper
              onSwiper={setSwiperInstance} // Store swiper instance in state
              spaceBetween={20}
              breakpoints={{
                // Mobile
                320: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                // Tablet
                768: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
                // Desktop
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
                // Large Desktop
                1280: {
                  slidesPerView: 6,
                  spaceBetween: 40,
                },
              }}
              className="py-6"
            >
              {goldCategories?.map((category) => (
                <SwiperSlide key={category._id}>
                  <a
                    // Dynamically generate a link based on the category name
                    href={`/shop/${category.categoryName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    {/* Elegant Circular Image Container */}
                    <div className="relative p-1.5 rounded-full bg-transparent border border-gray-200 group-hover:border-[#d4af37] transition-all duration-500 ease-out group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-[#fbfbfb]">
                        <img
                          src={category.categoryImage}
                          alt={category.categoryName}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                          }}
                        />
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="mt-6 text-center">
                      <h3 className="text-sm md:text-[15px] font-semibold text-gray-800 uppercase tracking-[0.15em] group-hover:text-[#d4af37] transition-colors duration-300">
                        {category.categoryName}
                      </h3>
                      {/* Animated underline effect on hover purely via Tailwind */}
                      <div className="h-[2px] w-0 bg-[#d4af37] mx-auto mt-1 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Next Button */}
            <button 
              onClick={() => swiperInstance?.slideNext()}
              className="absolute right-0 top-[40%] -translate-y-1/2 z-10 hidden md:flex w-11 h-11 items-center justify-center rounded-full bg-primary border border-white text-white shadow-md hover:bg-primary hover:border-[#d4af37] hover:text-white hover:scale-105 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition-all duration-300"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>

          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;