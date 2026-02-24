import React from 'react';

const DualBanners = () => {
  
  const banners = [
    {
      id: 1,
      
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', 
      alt: 'All you need is love. But a little jewellery never hurt anybody.',
      link: '/shop/bangles'
    },
    {
      id: 2,
      
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=800', 
      alt: 'We live every second of our day why not make every moment special?',
      link: '/shop/special-collection'
    }
  ];



//   main
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {banners.map((banner) => (
          <a 
            key={banner.id} 
            href={banner.link}
            
            className="block relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Zoom Effect:
              - 'transform transition-transform duration-700' creates the smooth animation.
              - 'group-hover:scale-110' zooms the image IN when hovering over the container.
              - Removing the hover state smoothly zooms it OUT back to normal scale.
            */}
            <img 
              src={banner.image} 
              alt={banner.alt} 
              
              className="w-full h-full object-cover aspect-[16/9] md:aspect-[8/5] transform transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            
            
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          </a>
        ))}

      </div>
    </section>
  );
};

export default DualBanners;