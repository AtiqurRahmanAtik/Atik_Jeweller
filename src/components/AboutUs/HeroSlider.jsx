import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import the Fade effect module
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import the required CSS for the fade effect
import 'swiper/css/bundle';

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade" 
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      speed={1000} 
      className="w-full h-[500px]"
    >
      <SwiperSlide>
        <div className="w-full h-full overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=800"
            alt="Kunjo Jewellers"
            
            className="ken-burns-image w-full h-full object-cover opacity-90"
          />
        </div>
      </SwiperSlide>
      
     
      
    </Swiper>
  );
};

export default HeroSlider;