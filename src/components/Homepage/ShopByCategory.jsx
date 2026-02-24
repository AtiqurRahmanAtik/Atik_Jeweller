

const categories = [
  {
    id: 1,
    name: 'EARRINGS',
    // Replace with your actual image paths
    image: '/images/category-earrings.jpg',
    link: '/shop/earrings'
  },
  {
    id: 2,
    name: 'NECKLACES',
    image: '/images/category-necklaces.jpg',
    link: '/shop/necklaces'
  },
  {
    id: 3,
    name: 'RINGS',
    image: '/images/category-rings.jpg',
    link: '/shop/rings'
  },
  {
    id: 4,
    name: 'BRACELETS',
    image: '/images/category-bracelets.jpg',
    link: '/shop/bracelets'
  },
  {
    id: 5,
    name: 'BANGLES',
    image: '/images/category-bangles.jpg',
    link: '/shop/bangles'
  },
  {
    id: 6,
    name: 'CHAINS',
    image: '/images/category-chains.jpg',
    link: '/shop/chains'
  },
];


// 
const ShopByCategory = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-800 mb-12">
          Popular Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 justify-items-center">
          {categories.map((category) => (
            <a 
              key={category.id} 
              href={category.link}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circular Image Container */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#d4af37]/30 group-hover:border-[#d4af37] transition-colors duration-300">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Category Name */}
              <h3 className="mt-4 text-sm md:text-base font-medium text-gray-700 uppercase tracking-wider group-hover:text-[#d4af37] transition-colors duration-300">
                {category.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;