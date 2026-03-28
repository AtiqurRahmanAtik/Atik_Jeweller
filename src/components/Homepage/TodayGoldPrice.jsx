import { useEffect } from "react";
import { useDailyPrice } from "../../Hook/useDailyPrice";



const TodayGoldPrice = () => {
  const { dailyPrices, loading, error, fetchDailyPrices } = useDailyPrice();

  console.log("DailyPrices : ",dailyPrices);


  // const TopPrice = dailyPrices.sort((a,b)=> b.ratePerVori - a.ratePerVori);
  // console.log("TopPrice : ", TopPrice);


 



  useEffect(() => {
    fetchDailyPrices(1, 100);
  }, [fetchDailyPrices]);

  if (loading) {



    return (
      <section className="py-12 bg-white w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 animate-pulse rounded-sm"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-500 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (!dailyPrices || dailyPrices.length === 0) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            No price data available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Heading --- */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] bg-gray-200 w-16 md:w-32"></div>
          <h2 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-wide">
            Today's Gold Price
          </h2>
          <div className="h-[1px] bg-gray-200 w-16 md:w-32"></div>
        </div>

        {/* --- Pricing List --- */}
        <div className="flex flex-col gap-3 md:gap-4">
          {dailyPrices.slice(0,5).map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_auto_1fr] md:grid-cols-3 items-center bg-[#f8f9fa] py-4 px-4 md:px-10 text-xs md:text-sm font-bold text-gray-800 rounded-sm"
            >
              {/* Left - Metal Type & Purity */}
              <div className="text-left tracking-wider">
                {item.purity} {item.metalType} (PER VORI)
              </div>

              {/* Center Divider */}
              <div className="text-center font-medium text-gray-900 mx-4 md:mx-0">
                |
              </div>

              {/* Right - Rate */}
              <div className="text-right tracking-wider">
                {item.ratePerVori.toLocaleString()} BDT
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TodayGoldPrice;