
import {
  MdDashboard,
  MdLogout,
  MdOutlineCategory,
  MdOutlineImage,
  MdOutlineMoreHoriz,
  MdOutlinePhotoSizeSelectActual,
  MdOutlineShoppingBag,

} from "react-icons/md";
import PrivateRoot from "./PrivateRoot";

const useMenuItems = () => {

  const allItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard className="text-lg" />,
    },
 
{
  title: "Ecommerce",
  icon: <MdOutlineShoppingBag className="text-lg" />,
  list: [
    {
      title: "Banner",
      path: "/ecommerce/banner",
      icon: <MdOutlineImage className="text-lg" />,
    },
    {
      title: "Three Dot Image",
      path: "/ecommerce/three-dot-image",
      icon: <MdOutlineMoreHoriz className="text-lg" />,
    },
    {
      title: "Product Category",
      path: "/ecommerce/product-category",
      icon: <MdOutlineCategory className="text-lg" />,
    },
    {
      title: "Products",
      path: "/ecommerce/products",
      icon: <MdOutlinePhotoSizeSelectActual className="text-lg" />,
    },
  ],
},


{
      title: "Logout",
      path: "/logout",
      icon: <MdLogout className="text-lg" />,
    },
  ];

  return allItems;
};

export default useMenuItems;