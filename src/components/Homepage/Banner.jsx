import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Banner = () => {
  const [banners, setBanners] = useState([]);

  const API_URL = process.env.REACT_APP_BACKEND_URL
    ? `${process.env.REACT_APP_BACKEND_URL}/banners/`
    : "http://localhost:8000/api/banners/";

  const getBanners = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data?.success) {
        setBanners(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    getBanners();
  }, [getBanners]);

  if (!banners.length) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] bg-gray-100 flex items-center justify-center animate-pulse">
        <span className="text-gray-400 font-medium">Loading Banners...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={banners.length > 1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
      >
        {banners.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="w-full h-full relative">
              <img
                src={slide.bannerUrl}
                alt={slide.bannerName || "Promotional Banner"}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = "https://placehold.co/1600x600?text=Image+Not+Found";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;