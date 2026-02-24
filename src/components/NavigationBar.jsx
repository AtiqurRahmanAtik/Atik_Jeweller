
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  ChevronDown, 
  Phone, 
  MapPin, 
  Menu, 
  ChevronRight
} from 'lucide-react';

const NavigationBar = () => {
  

const navItems = [
  { id: 1, name: 'HOME', path: '/' },
  { id: 2, name: 'SHOP', path: '/shop' },
  { id: 3, name: 'ABOUT US', path: '/aboutUs' },
  { id: 4, name: 'BLOG', path: '/blog' },
  { id: 5, name: 'CONTACT', path: '/contact' },
  { id: 6, name: 'FAQ', path: '/faq' },
  { id: 7, name: 'TERMS & CONDITION', path: '/terms' },
];
 

  const pageLinks = navItems.map((item) => (
    <li key={item.id}>
      <NavLink 
        to={item.path}
        className={({ isActive }) =>
          `uppercase font-bold text-[13px] tracking-wide bg-transparent transition-all ${
            isActive 
              ? 'border-b-2 border-black rounded-none text-black pb-1' 
              : 'text-gray-700 hover:text-black hover:bg-transparent'
          }`
        }
      >
       {item.name}
      </NavLink>
    </li>
  ));


//   categories here
  const categories = [
    { name: 'Bangle' },
    { name: 'Bracelet' },
    { name: 'Chain' },
    { name: 'Chur' },
    { name: 'Churi' },
    { name: 'Earrings' },
    { name: 'Locket' },
    { name: 'Necklace & Earring Set' },
    { name: 'Necklaces', hasSubmenu: true },
    { name: 'Rings', hasSubmenu: true },
    { name: 'Shitahar' },
  ];



//   main component
  return (
    <header className="w-full bg-base-100 shadow-sm">
      
     
      <nav className="navbar px-4 md:px-8 border-b border-gray-100 py-3">
        
      
        <div className="navbar-start">
          {/* Mobile Hamburger Menu */}
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <Menu size={24} />
            </div>
            <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {pageLinks}
            </ul>
          </div>

          <div className="hidden lg:block relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder="Search products" 
              className="input input-bordered w-full h-10 rounded-[2px] pr-10 focus:outline-none focus:border-gray-400" 
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
              <Search size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Center: Logo */}
        <div className="navbar-center">
          <NavLink to="/" className="flex flex-col items-center">
            
            <img 
              src="/kunjo-logo.png" 
              alt="Kunjo Jewellers" 
              className="h-16 object-contain" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
           
            <div className="hidden text-center">
              <h1 className="text-xl font-serif text-[#d4af37] font-bold uppercase tracking-widest">Kunjo</h1>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-black">Jewellers</p>
            </div>
          </NavLink>
        </div>

        {/* Right: User, Wishlist, Cart */}
        <div className="navbar-end gap-2 md:gap-4">
          <button className="btn btn-ghost btn-circle hover:bg-transparent">
            <User size={24} strokeWidth={1.5} className="text-gray-800" />
          </button>
          
          <button className="btn btn-ghost btn-circle hover:bg-transparent">
            <div className="indicator">
              <Heart size={24} strokeWidth={1.5} className="text-gray-800" />
              <span className="badge indicator-item badge-sm bg-[#222222] border-none text-white font-bold w-5 h-5 rounded-full p-0">0</span>
            </div>
          </button>

          <button className="btn btn-ghost btn-circle hover:bg-transparent">
            <div className="indicator">
              <ShoppingCart size={24} strokeWidth={1.5} className="text-gray-800" />
              <span className="badge indicator-item badge-sm bg-[#222222] border-none text-white font-bold w-5 h-5 rounded-full p-0">0</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Hidden on mobile, visible on large screens */}
      <nav className="navbar px-4 md:px-8 min-h-[50px] hidden lg:flex">
        
        {/* Left: Browse Categories */}
      <div className="navbar-start w-auto mr-8">
      <div className="dropdown dropdown-hover">
        {/* Trigger Button */}
        <div 
          tabIndex={0} 
          role="button" 
          className="flex items-center gap-2 font-bold text-[14px] text-gray-800 tracking-wide cursor-pointer h-full py-2"
        >
          BROWSE CATEGORIES <ChevronDown size={16} strokeWidth={2.5} />
        </div>
        
        {/* Category Dropdown Items */}
        <ul 
          tabIndex="-1" 
          className="dropdown-content bg-base-100 z-30 w-60 shadow-lg border border-gray-200 rounded-sm p-0 mt-2"
        >
          {categories.map((category, index) => (
            <li 
              key={index} 
              className={`border-gray-200 ${index !== categories.length - 1 ? 'border-b' : ''}`}
            >
              <li className="flex justify-between items-center px-4 py-3 text-[14px] text-gray-700 hover:bg-gray-50 hover:text-black cursor-pointer transition-colors">
                {category.name}
                {category.hasSubmenu && (
                  <ChevronRight size={14} className="text-gray-400" />
                )}
              </li>
            </li>
          ))}
        </ul>
      </div>
    </div>

        {/* Center: Main Page  */}
        <div className="navbar-center flex-1 justify-center">
          <ul className="menu menu-horizontal px-1 gap-1">
            
            {pageLinks}

          </ul>
        </div>

        {/* Right: Contact & Store Info */}
        <div className="navbar-end w-auto gap-6 font-medium text-[14px] text-gray-700">
          <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
            <Phone size={18} strokeWidth={1.5} /> 01716-522922
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
            <MapPin size={18} strokeWidth={1.5} /> Find Store
          </div>
        </div>
        
      </nav>

    </header>
  );
};

export default NavigationBar;