
import { Headphones, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom'; 
const Footer = () => {
  
  const aboutLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  const categoryLinks = [
    { name: 'Necklaces', path: '/shop/necklaces' },
    { name: 'Rings', path: '/shop/rings' },
    { name: 'Churi', path: '/shop/churi' },
    { name: 'Chain', path: '/shop/chain' },
    { name: 'Shitahar', path: '/shop/shitahar' },
    { name: 'Locket', path: '/shop/locket' },
  ];

  return (
    <footer className="bg-white pt-16 pb-6 border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 mb-12">
          
          
          <div className="flex flex-col items-start lg:items-center">
            
            <img 
              src="/kunjo-logo.png" 
              alt="Kunjo Jewellers" 
              className="h-24 object-contain mb-2"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
           

            <div className="hidden text-center">
              <h2 className="text-2xl font-serif text-[#d4af37] font-bold uppercase tracking-widest">Kunjo</h2>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-black">Jewellers</p>
              <p className="text-[10px] text-gray-500 italic mt-1">Gold & Diamond</p>
            </div>
          </div>

          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-5">About Kunjo Jewellers</h4>
            <ul className="flex flex-col gap-3">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-[14px] text-gray-500 hover:text-[#d4af37] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-5">Popular Categories</h4>
            <ul className="flex flex-col gap-3">
              {categoryLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-[14px] text-gray-500 hover:text-[#d4af37] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-5">Store Details</h4>
            
           
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <Headphones size={20} />
              </div>
              <div>
                <p className="text-[12px] text-gray-500">Need Any Help?</p>
                <p className="text-lg font-medium text-gray-800 tracking-wide">01716-522922</p>
              </div>
            </div>

           
            <div className="text-[14px] text-gray-500 leading-relaxed mb-3">
              <span className="font-medium text-gray-700">Address:</span> Jamuna Future Park Lavel<br />
              02 Block A Shop No 28<br />
              Bashundhara Dhaka-1229
            </div>

            <div className="text-[14px] text-gray-500">
              <span className="font-medium text-gray-700">Email:</span> KunjoJewellers@gmail.com
            </div>
          </div>

          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-5">Follow Us</h4>
            <div className="flex items-center gap-4 text-gray-800">
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
             
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                <Music2 size={20} strokeWidth={1.5} /> 
              </a>
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                <Youtube size={22} strokeWidth={1.5} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 pt-6 mt-8 flex justify-center">
          <p className="text-[13px] text-gray-500 text-center">
            &copy; 2026 All Rights Reserved By Kunjo Jewellers. Designed & Maintained By Imran Sadik.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;