
import { Outlet,  } from "react-router-dom";

import Footer from '../../components/Footer';
import NavigationBar from "../../components/NavigationBar";


const Root = () => {

    
  


    return (
        <div>

         
        <header>
          <NavigationBar />
        </header>
      
        
        {/* Dynamic section */}
        <main className=''>
            <Outlet />
        </main>


        <footer>
            <Footer/>
        </footer>

      
    </div>
    );
};

export default Root;