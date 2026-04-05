import React from 'react';
// IMPORTANT: Adjust this path to point to where your useTwoDotBanners hook is saved!
import useTwoDotBanners from '../../Hook/useTwoDotBanners'; 

const DualBanners = () => {
  // Destructure the data, loading state, and error state from your custom API hook
  const { banners, loading, error } = useTwoDotBanners();

  // Show a loading state while fetching data from the backend
  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  // Show an error message if the API fails
  if (error) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center text-red-500 font-medium">
          Failed to load banners: {error}
        </div>
      </section>
    );
  }

  // If the API call succeeds but there are no banners in the database, render nothing (or a fallback)
  if (!banners || banners.length === 0) {
    return null;
  }

  // Main UI
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Map through the dynamic array of banners coming from your backend */}
        {banners.map((banner) => (
          <a 
            key={banner._id} // Using the MongoDB _id from your backend
            href={banner.link || '#'} // Fallback to '#' if you don't have a link field in your DB
            className="block relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Zoom Effect:
              - 'transform transition-transform duration-700' creates the smooth animation.
              - 'group-hover:scale-110' zooms the image IN when hovering over the container.
              - Removing the hover state smoothly zooms it OUT back to normal scale.
            */}
            <img 
              src={banner.imageUrl} // Mapped to the imageUrl from your API
              alt={banner.imageName} // Mapped to the imageName from your API
              className="w-full h-full object-cover aspect-[16/9] md:aspect-[8/5] transform transition-transform duration-700 ease-in-out group-hover:scale-110"
              onError={(e) => { 
                // Fallback just in case the image URL from the database is broken
                e.target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found'; 
              }}
            />
            
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          </a>
        ))}

      </div>
    </section>
  );
};

export default DualBanners;