import React from 'react';
import {
  MdDashboard,
  MdViewList,
  MdDesktopMac,
  MdCleaningServices,
  MdPointOfSale,
  MdEvent,
  MdLayers,
  MdAccountBalance,
  MdSettings,
  MdAdminPanelSettings,
  MdLogout,
  MdDateRange,
  MdPeople,
  MdEventNote,
  MdAssignment,
  MdDescription,
  MdReceipt,
  MdShoppingCart,
  MdKitchen,
  MdTableRestaurant,
  MdInventory,
  MdLocalShipping,
  MdSwapHoriz,
  MdInput,
  MdOutput,
  MdDeleteSweep,
  MdAttachMoney,
  MdMoneyOff,
  MdNoteAdd,
  MdAccountBalanceWallet,
  MdVpnKey,
  MdLanguage,
  MdFlag,
  MdCurrencyExchange,
  MdFeedback,
  MdBusiness,
  MdSupervisedUserCircle,
  MdHistory,
  MdSecurity,
  MdComputer,
  MdInsertChart,
  MdSettingsSuggest,
  MdAssessment
} from "react-icons/md";

const useMenuItems = () => {

  const allItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard className="text-lg" />,
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