import React from 'react';

const PromotionalBanners = () => {
  // Array holding the banner data. 
  // Replace the placeholder image URLs with the actual paths to your cropped banner images.
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', // Replace with your Black/Gold banner path (e.g., '/banners/banner-1.jpg')
      alt: 'Casual and comfortable jewellery',
      link: '/shop/casual'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=600', // Replace with your Red Wedding Collection banner path
      alt: 'Wedding Jewellery Collection',
      link: '/shop/wedding'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', // Replace with your Navy/Gold Precious banner path
      alt: 'Jewellery is precious just like you',
      link: '/shop/precious'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Responsive Grid: 
        1 column on mobile (grid-cols-1)
        3 columns on desktop (md:grid-cols-3) 
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {banners.map((banner) => (
          <a 
            key={banner.id} 
            href={banner.link}
            className="block relative overflow-hidden rounded-sm group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image with zoom effect on hover (group-hover:scale-105)
              'aspect-[4/3]' ensures all images maintain the same rectangular proportion 
              even before they fully load. You can adjust this ratio if your actual images are wider/taller.
            */}
            <img 
              src={banner.image} 
              alt={banner.alt} 
              className="w-full h-full object-cover aspect-[4/3] md:aspect-[5/4] transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            
            {/* Optional: A very subtle dark overlay that lightens on hover to draw attention */}
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-500"></div>
          </a>
        ))}

      </div>
    </section>
  );
};

export default PromotionalBanners;