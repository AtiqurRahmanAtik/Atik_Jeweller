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

import Products from "../pages/Ecommerce/Products/Products";
import GoldPrice from "../pages/GoldPrice/GoldPrice";
import ProductList from "../pages/Product/ProductList/ProductList";
import AddProduct from "../pages/Product/AddProduct/AddProduct";
import MetalProductCategory from "../pages/Product/MetalProductCategory/MetalProductCategory";
import MyStocks from "../pages/MyStocks/MyStocks";
import ReturnList from "../pages/Sales/ReturnList/ReturnList";
import SalesList from "../pages/Sales/SalesList/SalesList";
import PosSale from "../pages/Sales/PosSale/PosSale";
import Sale from "../pages/Sales/Sale/Sale";
import { MdOutlinePeople, MdOutlinePerson, MdOutlineReceiptLong } from "react-icons/md";
import DueList from "../pages/Customer/DueList/DueList";
import Customer from "../pages/Customer/Customer/Customer";
import ArtisanPayment from "../pages/Order/ArtisanPayment/ArtisanPayment";
import OrderList from "../pages/Order/OrderList/OrderList";
import AddOrder from "../pages/Order/AddOrder/AddOrder";
import MetalType from "../pages/Setting/MetalType/MetalType";
import Purity from "../pages/Setting/Purity/Purity";
import GoldCategory from "../pages/Setting/GoldCategory/GoldCategory";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import FeaturedProducts from "../components/Homepage/FeaturedProducts";
import HomePage from "../pages/HomePage/HomePage";
import ShopDetails from "../pages/ShopDetails/ShopDetails";
import TrendyCollection from "../pages/Ecommerce/TrendyCollection/TrendyCollection";
import TrendyCollectionDetails from "../pages/Trendycollectiondetails/Trendycollectiondetails";





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
    element: <NavHome />, // NavHome stays on the screen always
    children: [
      {
        path: "/", // When the user is at the root URL
        element: <HomePage />, // Show all the banners and sliders
      },
      {
        path: "product/:id", // When the user clicks Quick View
        element: <ProductDetails /> // Show ONLY the product details
      },
      {
  path: "trendy-collection/:id",
  element: <TrendyCollectionDetails />
}
    ]
  }
,


// Remove the "children: []" array completely and separate the routes like this:

{
  path: "/shop",
  element: <Shop />
},
{
  path: "/shop/product-category/:categoryName", 
  element: <Shop />
},
{
  path: "/shop/:id", // This perfectly matches the <Link> in your Shop.js!
  element: <ShopDetails />
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
        path: "goldPrice",
        element: <PrivateRoot><GoldPrice/> </PrivateRoot>
      },
     


      {
  path: "product",
  children: [
    {
      path: "list",
      element: (
        <PrivateRoot>
          <ProductList />
        </PrivateRoot>
      ),
    },
    {
      path: "add",
      element: (
        <PrivateRoot>
          <AddProduct />
        </PrivateRoot>
      ),
    },
    {
      path: "category",
      element: (
        <PrivateRoot>
          <MetalProductCategory />
        </PrivateRoot>
      ),
    },
  ],
},

 {
        path: "myStocks",
        element: <PrivateRoot><MyStocks/> </PrivateRoot>
      },

      // sales

      {
  path: "sales",
  children: [
    {
      path: "sale",
      element: (
        <PrivateRoot>
          <Sale />
        </PrivateRoot>
      ),
    },
    {
      path: "pos-sale",
      element: (
        <PrivateRoot>
          <PosSale />
        </PrivateRoot>
      ),
    },
    {
      path: "list",
      element: (
        <PrivateRoot>
          <SalesList />
        </PrivateRoot>
      ),
    },
    {
      path: "return-list",
      element: (
        <PrivateRoot>
          <ReturnList />
        </PrivateRoot>
      ),
    },
  ],
},

{
  path: "customer",
  children: [
    {
      path: "customer",
      element: (
        <PrivateRoot>
          <Customer />
        </PrivateRoot>
      ),
    },
    {
      path: "due-list",
      element: (
        <PrivateRoot>
          <DueList />
        </PrivateRoot>
      ),
    },
  ],
},

{
  path: "order",
  children: [
    {
      path: "add-order",
      element: (
        <PrivateRoot>
          <AddOrder />
        </PrivateRoot>
      ),
    },
    {
      path: "order-list",
      element: (
        <PrivateRoot>
          <OrderList />
        </PrivateRoot>
      ),
    },
    {
      path: "artisan-payment",
      element: (
        <PrivateRoot>
          <ArtisanPayment />
        </PrivateRoot>
      ),
    },
  ],
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
      path: "products",
      element: (
        <PrivateRoot>
          <Products />
        </PrivateRoot>
      ),
    },
    {
      path: "trendycollection",
      element: (
        <PrivateRoot>
          <TrendyCollection />
        </PrivateRoot>
      ),
    },
  ],
},     
     



{
  path: "setting",
  children: [
    {
      path: "metal-type",
      element: (
        <PrivateRoot>
          <MetalType />
        </PrivateRoot>
      ),
    },
    {
      path: "purity",
      element: (
        <PrivateRoot>
          <Purity />
        </PrivateRoot>
      ),
    },
      {
      path: "GoldCategory",
      element: (
        <PrivateRoot>
          <GoldCategory />
        </PrivateRoot>
      ),
    }
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