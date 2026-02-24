import AutumnCollection from "../../components/Homepage/AutumnCollection";
import Banner from "../../components/Homepage/Banner";
import PromotionalBanners from "../../components/Homepage/PromotionalBanners";
import ShopByCategory from "../../components/Homepage/ShopByCategory";
import TrendyCollection from "../../components/Homepage/TrendyCollection";


const NavHome = () => {
    return (
        <>
            

            <Banner />

            <PromotionalBanners/>

            <ShopByCategory/>

            <TrendyCollection/>

            <AutumnCollection/>
            
        </>
    );
};

export default NavHome;
