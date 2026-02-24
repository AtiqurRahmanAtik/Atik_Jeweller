import AutumnCollection from "../../components/Homepage/AutumnCollection";
import Banner from "../../components/Homepage/Banner";
import DualBanners from "../../components/Homepage/DualBanners";
import FeaturedProducts from "../../components/Homepage/FeaturedProducts";
import PromotionalBanners from "../../components/Homepage/PromotionalBanners";
import ShopByCategory from "../../components/Homepage/ShopByCategory";
import TodayGoldPrice from "../../components/Homepage/TodayGoldPrice";
import TrendyCollection from "../../components/Homepage/TrendyCollection";


const NavHome = () => {
    return (
        <>
            

            <Banner />

            <PromotionalBanners/>

            <ShopByCategory/>

            <TrendyCollection/>

            <AutumnCollection/>

            <DualBanners/>

            <FeaturedProducts/>

            <TodayGoldPrice/>
            
        </>
    );
};

export default NavHome;
