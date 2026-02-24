import React from 'react';

const AboutHeader = () => {
  return (
    <section className="bg-[#f8f9fa] w-full py-20 px-4 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl mx-auto">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-800 font-medium mb-4 tracking-wide">
          About Kunjo Jewellers
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm md:text-base text-gray-500 font-light">
          Welcome to the official page of Kunjo Jewellers.
        </p>
      </div>
    </section>
  );
};

export default AboutHeader;