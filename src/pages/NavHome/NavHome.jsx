// src/layouts/NavHome.jsx
import React from 'react';
import { Outlet } from "react-router-dom";
// Import your Navbar and Footer here if you have them!
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

const NavHome = () => {
    return (
        <>
            {/* <Navbar /> */}  {/* If you have a navbar, it goes here */}
            
            <main className="min-h-screen bg-gray-50">
                {/* When URL is "/", Outlet becomes HomePage 
                  When URL is "/product/:id", Outlet becomes ProductDetails 
                */}
                <Outlet /> 
            </main>

            {/* <Footer /> */}  {/* If you have a footer, it goes here */}
        </>
    );
};

export default NavHome;