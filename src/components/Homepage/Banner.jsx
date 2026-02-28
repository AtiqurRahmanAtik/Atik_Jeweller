

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

const Banner = () => {
  
  const sliderData = [
    {
      id: 1,
      image: '/HomeBan.jpg', 
      alt: 'Kunjo Jewellers Exclusive Wedding Jewellery',
    },
    {
      id: 2,
     
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1600', 
      alt: 'Luxury Gold Collection',
    },
    {
      id: 3,
      
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=1600', 
      alt: 'Diamond Necklace Collection',
    },
    {
      id: 4,
      
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600', 
      alt: 'Bridal Jewellery Set',
    },
  ];

  const [banner, SetBanner] = useState([]);
  console.log("Banner Data : ", banner);
  


  const getBanner = async()=>{

     const res = await axios.get("http://localhost:8000/api/banners/");

     SetBanner(res.data)

     return res.data;

  }

  

    useEffect(()=>{
      
      getBanner();
     

    })
  



  return (
    <div className="w-full bg-gray-50">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3500, 
         
        }}
        pagination={{
          clickable: true,
         
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        
        className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-full relative">
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;