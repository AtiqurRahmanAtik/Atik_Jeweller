
import {
  MdDashboard,
  MdLogout,
  MdOutlineAddBox,
  MdOutlineAddShoppingCart,
  MdOutlineAssignmentReturn,
  MdOutlineCategory,
  MdOutlineImage,
  MdOutlineInventory,
  MdOutlineList,
  MdOutlineListAlt,
  MdOutlineMoreHoriz,
  MdOutlinePayments,
  MdOutlinePeople,
  MdOutlinePerson,
  MdOutlinePhotoSizeSelectActual,
  MdOutlinePointOfSale,
  MdOutlineReceiptLong,
  MdOutlineSettings,
  MdOutlineShoppingBag,
  MdOutlineShoppingCart,
  MdOutlineVerified,

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
      title: "Gold Price",
      path : "/goldPrice",
       icon: <MdDashboard className="text-lg" />,
    },
     

    {
  title: "Product",
  icon: <MdOutlineInventory className="text-lg" />,
  list: [
    {
      title: "Product list",
      path: "/product/list",
      icon: <MdOutlineList className="text-lg" />,
    },
    {
      title: "Add Product",
      path: "/product/add",
      icon: <MdOutlineAddBox className="text-lg" />,
    },
    {
      title: "Category",
      path: "/product/category",
      icon: <MdOutlineCategory className="text-lg" />,
    },
  ],
},



    {
  title: "Sales",
  icon: <MdOutlinePointOfSale className="text-lg" />,
  list: [
    {
      title: "Sale",
      path: "/sales/sale",
      icon: <MdOutlineShoppingCart className="text-lg" />,
    },
    {
      title: "Pos Sale",
      path: "/sales/pos-sale",
      icon: <MdOutlinePointOfSale className="text-lg" />,
    },
    {
      title: "Sales List",
      path: "/sales/list",
      icon: <MdOutlineList className="text-lg" />,
    },
    
  ],
},

{
  title: "Purchase",
  icon: <MdOutlinePeople className="text-lg" />,
  list: [
    {
      title: "Purchase",
      path: "/purchase/purchase",
      icon: <MdOutlinePerson className="text-lg" />,
    },
    {
      title: "Purchase List",
      path: "/purchase/purchaseList",
      icon: <MdOutlineReceiptLong className="text-lg" />,
    },
  ],
},


{
  title: "Customer",
  icon: <MdOutlinePeople className="text-lg" />,
  list: [
    {
      title: "Customer",
      path: "/customer/customer",
      icon: <MdOutlinePerson className="text-lg" />,
    },
    {
      title: "Due List",
      path: "/customer/due-list",
      icon: <MdOutlineReceiptLong className="text-lg" />,
    },
  ],
},

{
  title: "Order",
  icon: <MdOutlineShoppingCart className="text-lg" />,
  list: [
    {
      title: "Add Order",
      path: "/order/add-order",
      icon: <MdOutlineAddShoppingCart className="text-lg" />,
    },
    {
      title: "Order List",
      path: "/order/order-list",
      icon: <MdOutlineListAlt className="text-lg" />,
    },
    {
      title: "artisan Payment",
      path: "/order/artisan-payment",
      icon: <MdOutlinePayments className="text-lg" />,
    },
  ],
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
      title: "Products",
      path: "/ecommerce/products",
      icon: <MdOutlinePhotoSizeSelectActual className="text-lg" />,
    },
     {
      title: "Two Dot Image",
      path: "/ecommerce/two-dot-image",
      icon: <MdOutlinePhotoSizeSelectActual className="text-lg" />,
    },
    {
      title: "Trendy Collection",
      path: "/ecommerce/trendycollection",
      icon: <MdOutlinePhotoSizeSelectActual className="text-lg" />,
    },
    {
      title: "Autumn Collection",
      path: "/ecommerce/autumncollection",
      icon: <MdOutlinePhotoSizeSelectActual className="text-lg" />,
    },
    
  ],
},

{
  title: "Setting",
  icon: <MdOutlineSettings className="text-lg" />,
  list: [
     {
      title: "Stocks",
      path : "/myStocks",
       icon: <MdDashboard className="text-lg" />,
    },
    {
      title: "Metal Type",
      path: "/setting/metal-type",
      icon: <MdOutlineCategory className="text-lg" />,
    },
    {
      title: "Purity",
      path: "/setting/purity",
      icon: <MdOutlineVerified className="text-lg" />,
    },
    
     {
      title: "Product Category",
      path: "/setting/GoldCategory",
      icon: <MdOutlineVerified className="text-lg" />,
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