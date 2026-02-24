

const TodayGoldPrice = () => {

  const goldPrices = [
    {
      id: 1,
      type: '22 KDM CREATE GOLD (PER GRAM)',
      price: '22,380 BDT',
    },
    {
      id: 2,
      type: '21 KDM CREATE GOLD (PER GRAM)',
      price: '21,360 BDT',
    },
    {
      id: 3,
      type: '18 KDM CREATE GOLD (PER GRAM)',
      price: '18,310 BDT',
    },
  ];

  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
       
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] bg-gray-200 w-16 md:w-32"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Today's Gold Price
          </h2>
          <div className="h-[1px] bg-gray-200 w-16 md:w-32"></div>
        </div>

        {/* --- Pricing List --- */}
        <div className="flex flex-col gap-3 md:gap-4">
          {goldPrices.map((item) => (
            <div 
              key={item.id}
             
              className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-3 items-center bg-[#f8f9fa] py-4 px-4 md:px-10 text-xs md:text-sm font-bold text-gray-800 rounded-sm"
            >
             
              <div className="text-left tracking-wider">
                {item.type}
              </div>

             
              <div className="text-center font-medium text-gray-900 mx-4 md:mx-0">
                |
              </div>

             
              <div className="text-right tracking-wider">
                {item.price}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TodayGoldPrice;