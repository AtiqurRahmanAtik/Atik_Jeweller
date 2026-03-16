import React, { useEffect } from 'react';
import { useThreeDotImages } from '../../Hook/useThreeDotImages'; // Make sure this path matches your folder structure

const PromotionalBanners = () => {
  // Destructure state and functions from the hook
  const { 
    threeDotImages, 
    loading, 
    fetchAllThreeDotImages 
  } = useThreeDotImages();

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchAllThreeDotImages();
  }, [fetchAllThreeDotImages]);

  // Loading State
  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((skeleton) => (
            <div 
              key={skeleton} 
              className="w-full aspect-[4/3] md:aspect-[5/4] bg-gray-200 animate-pulse rounded-sm"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  // If no images exist, don't render the section (or you can show a fallback)
  if (!threeDotImages || threeDotImages.length === 0) {
    return null; 
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* We slice(0, 3) just in case there are more than 3 images in the DB, to keep the 3-grid layout perfect */}
        {threeDotImages.slice(0, 3).map((banner) => (
          <a 
            key={banner._id} 
            href={`/shop/${banner.imageName.toLowerCase().replace(/\s+/g, '-')}`} // Dynamically creates a link based on the name, or use "#"
            className="block relative overflow-hidden rounded-sm group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            
            <img 
              src={banner.imageUrl} 
              alt={banner.imageName} 
              className="w-full h-full object-cover aspect-[4/3] md:aspect-[5/4] transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
              onError={(e) => { 
                e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found"; 
              }}
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-500"></div>
          </a>
        ))}

      </div>
    </section>
  );
};

export default PromotionalBanners;