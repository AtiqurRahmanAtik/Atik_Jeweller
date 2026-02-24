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








export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
   
   

      // If you still need the Login page, you can add it on a separate path like this:
      // 
      // {
      //   path: "/",
      //   element: <Login />,
      // },
      

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
      }


    ],
  },
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

     
    
      // --- Logout ---
      {
        path: "logout",
        element: <PrivateRoot><Navigate to="/" replace /></PrivateRoot>,
      },
    ],
  },
]);