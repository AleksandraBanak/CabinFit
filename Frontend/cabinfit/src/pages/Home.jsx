import useAuth from "../hooks/useAuth";
import ServiceBenefits from "../components/Home/ServiceBenefits";
import BestSellersSection from "../components/UI/BestSellersSection";
import HomePromoPanel from "../components/UI/HomePromoPanel";
import HomeCollectionsBanner from "../components/UI/HomeCollectionsBanner";
import { Link } from "react-router-dom";

const Home = () => {
  const { token } = useAuth();

  const showState = () => {
    console.log(token);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Your travel journey starts here</p>

          <h1 className="hero-title text-uppercase">
            SAVE UP TO 50%
          </h1>

          <button className="hero-button">
            <Link to="/products" className="">Shop now</Link></button>
        </div>
      </div>

      <BestSellersSection />
      <HomePromoPanel />
      <HomeCollectionsBanner />
      <ServiceBenefits />
    </>
  );
};

export default Home;
