// ShopLayout.js (or wherever your layout is)
import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Footer from './Footer';

const ShopLayout = () => {
  return (
    <div>
      {/* <Header /> (If you have a header, it goes here) */}
      
      {/* THIS IS THE FIX: The Outlet tells React Router to inject Shop.js right here! */}
      <main>
        <Outlet /> 
      </main>

      {/* <Footer /> (If you have a footer, it goes here) */}
    </div>
  );
};

export default ShopLayout;