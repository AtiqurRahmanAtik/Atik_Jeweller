import { createBrowserRouter, Navigate } from "react-router-dom";


import Root from "./Root/Root";
import PrivateRoot from "./Root/PrivateRoot";
import Aroot from "./Root/Aroot";

import Home from "../pages/Dashboard/Home";


import Login from "../pages/Login/Login";
import Error404 from "../pages/Error404/Error404";

import Shop from "../pages/Shop/Shop";
import NavHome from "../pages/NavHome/NavHome";
import AboutUs from "../pages/AboutUs/AboutUs";
import TearmsOfUse from "../pages/TearmsOfUse/TearmsOfUse";

import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import CookiesPolicy from "../pages/CookiesPolicy/CookiesPolicy";
import RefundPolicy from "../pages/RefundPolicy/RefundPolicy";

import BannerCreate from "../pages/Ecommerce/BannerCreate/BannerCreate";
import ThreeDotImage from "../pages/Ecommerce/ThreeDotImage/ThreeDotImage";
import ProductCategory from "../pages/Ecommerce/ProductCategory/ProductCategory";
import Products from "../pages/Ecommerce/Products/Products";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
   
  
      // If you still need the Login page, you can add it on a separate path like this:
      // 
      {
        path: "/login",
        element: <Login />,
      },
      

      // Navbar routes
      {
        path: "/",
        element: <NavHome/>
      },
      {
        path: "/shop",
        element: <Shop/>
      },
      {
        path: "/aboutUs",
        element : <AboutUs/>
      },
      {
        path: "/termsOfUse",
        element : <TearmsOfUse/>

      },
      {
        path: "/privacy",
        element : <PrivacyPolicy/>

      },
      {
        path: "/cookies",
        element : <CookiesPolicy/>

      },
      {
        path: "/refund",
        element : <RefundPolicy/>

      }


    ],
  },


  // DashBoard 
  {
    // Pathless layout route to wrap everything in Aroot (Sidebar/Header)
    element: <Aroot />,
    errorElement: <Error404 />,
    children: [
      // --- Dashboard ---
      {
        path: "dashboard",
        element: <PrivateRoot><Home/></PrivateRoot>,
      },

{
  path: "ecommerce",
  children: [
    {
      path: "banner",
      element: (
        <PrivateRoot>
          <BannerCreate />
        </PrivateRoot>
      ),
    },
    {
      path: "three-dot-image",
      element: (
        <PrivateRoot>
          <ThreeDotImage />
        </PrivateRoot>
      ),
    },
    {
      path: "product-category",
      element: (
        <PrivateRoot>
          <ProductCategory />
        </PrivateRoot>
      ),
    },
    {
      path: "products",
      element: (
        <PrivateRoot>
          <Products />
        </PrivateRoot>
      ),
    },
  ],
},     
     
    
      // --- Logout ---
      {
        path: "logout",
        element: <PrivateRoot><Navigate to="/" replace /></PrivateRoot>,
      },
    ],
  },
]);