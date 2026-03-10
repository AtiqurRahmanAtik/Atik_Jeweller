import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import useMenuItems from "./MenuItems"; // Ensure correct import path

// 💡 Import both logo versions
import Logo from "../../assets/Logo/logo.png";
import Logo_Dark from "../../assets/Logo/logo_dark.png"; 


const AccordionItem = ({ item, isSidebarOpen, mode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Check if any child route is currently active
    const isChildActive = item.list?.some(child => location.pathname === child.path);
    // Determine if the parent should appear open/active
    const isParentActive = isOpen || isChildActive;

    // --- RECURSIVE LOGIC START ---
    if (item.list) {
        return (
            <li className="my-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex justify-between items-center p-3 rounded-xl shadow-sm transition-all relative overflow-hidden ${
                        isParentActive 
                            ? "bg-gradient-to-r from-[#df913e] to-primary text-white" 
                            : "bg-white text-gray-700 hover:bg-orange-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                    {/* Active Left Indicator Bar */}
                    {isParentActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md"></div>
                    )}

                    <div className="flex items-center gap-3 ml-1">
                        {/* Icon Wrapper (Orange when inactive, White when active) */}
                        <div className={`${isParentActive ? "text-white" : "text-primary dark:text-gray-300"}`}>
                            {item.icon}
                        </div>
                        {isSidebarOpen && <span className="font-semibold text-sm">{item.title}</span>}
                    </div>
                    
                    {isSidebarOpen && (
                        isParentActive ? (
                            <div className="w-2 h-2 rounded-full bg-white mr-2"></div> // White dot when open (like your image)
                        ) : (
                            <MdChevronRight className="transition-transform text-gray-400" />
                        )
                    )}
                </button>
                
                {/* Render Children */}
                {isOpen && isSidebarOpen && (
                    <ul className="mt-2 space-y-2">
                        {item.list.map((child) => {
                            const isChildCurrent = location.pathname === child.path;
                            return (
                                <li key={child.title} className="w-full">
                                    <Link
                                        to={child.path}
                                        className={`flex p-3 ml-4 mr-1 rounded-xl gap-3 items-center transition-all ${
                                            isChildCurrent 
                                                ? "bg-white shadow-sm text-gray-800 font-semibold" 
                                                : "text-gray-600 hover:bg-white/60 font-medium"
                                        }`}
                                    >
                                        <div className="text-gray-500">
                                            {child.icon}
                                        </div>
                                        <span className="text-sm">{child.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    } 
    // --- RECURSIVE LOGIC END ---

    else {
        // Flat Links (No children)
        const isActive = location.pathname === item.path;
        
        return (
            <li className="my-2">
                <Link
                    to={item.path}
                    className={`w-full flex p-3 rounded-xl shadow-sm transition-all items-center gap-3 relative overflow-hidden ${
                        isActive 
                            ? "bg-gradient-to-r from-[#df913e] to-primary text-white" 
                            : "bg-white text-gray-700 hover:bg-orange-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                    {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md"></div>
                    )}
                    <div className={`ml-1 ${isActive ? "text-white" : "text-primary dark:text-gray-300"}`}>
                        {item.icon}
                    </div>
                    {isSidebarOpen && <span className="font-semibold text-sm">{item.title}</span>}
                </Link>
            </li>
        );
    }
};

const Sidebar = ({ isSidebarOpen, toggleSidebar, mode }) => {
    // Get menu items
    const menuItems = useMenuItems();
    
    // Using your 'secondary' background color for the main sidebar
    const sidebarClasses = `
        fixed top-0 left-0 h-full shadow-lg z-30 transition-all duration-300 flex flex-col
        bg-secondary dark:bg-gray-900 
        ${isSidebarOpen
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full md:w-[85px] md:translate-x-0'
        }
    `;

    const currentLogo = mode === 'dark' ? Logo_Dark : Logo;

    return (
        <>
            {/* Mobile Overlay */}
            <div
                onClick={toggleSidebar}
                className={`fixed inset-0 bg-black/50 z-20 transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            ></div>

            {/* Sidebar Container */}
            <div className={sidebarClasses}>
                
                {/* Custom Top Header Card (Matching your image) */}
                <div className={`m-3 mt-4 mb-2 p-3 rounded-xl shadow-md transition-all flex items-center gap-3 
                    bg-gradient-to-r from-[#e8ac46] via-[#d78b2e] to-primary text-white
                    ${!isSidebarOpen && 'justify-center p-2'}
                `}>
                    <div className="bg-white p-1 rounded-lg flex-shrink-0 shadow-sm">
                        <img 
                            src={currentLogo} 
                            alt="Logo" 
                            className={`transition-all duration-300 object-contain ${isSidebarOpen ? 'w-10 h-10' : 'w-8 h-8'}`} 
                        />
                    </div>
                    
                    {isSidebarOpen && (
                        <div className="flex flex-col truncate">
                            <span className="font-bold text-[15px] leading-tight text-white drop-shadow-sm">Jewellery Software</span>
                            <span className="text-xs text-white/90 font-medium">Owner</span>
                        </div>
                    )}
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
                    <ul>
                        {menuItems.map((item) => (
                            <AccordionItem 
                                key={item.title} 
                                item={item} 
                                isSidebarOpen={isSidebarOpen} 
                                mode={mode} 
                            />
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;