
const PromotionalBanners = () => {
  
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', 
      alt: 'Casual and comfortable jewellery',
      link: '/shop/casual'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?auto=format&fit=crop&q=80&w=600', 
      alt: 'Wedding Jewellery Collection',
      link: '/shop/wedding'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', 
      alt: 'Jewellery is precious just like you',
      link: '/shop/precious'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {banners.map((banner) => (
          <a 
            key={banner.id} 
            href={banner.link}
            className="block relative overflow-hidden rounded-sm group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
           
            <img 
              src={banner.image} 
              alt={banner.alt} 
              className="w-full h-full object-cover aspect-[4/3] md:aspect-[5/4] transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            
           
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-500"></div>
          </a>
        ))}

      </div>
    </section>
  );
};

export default PromotionalBanners;