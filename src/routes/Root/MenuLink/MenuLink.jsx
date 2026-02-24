import React from "react";
import { Link } from "react-router-dom";

const MenuLink = ({ item, location, isCollapsed }) => {
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-[#eba21c] text-white shadow"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {item.icon}
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
};

export default MenuLink;