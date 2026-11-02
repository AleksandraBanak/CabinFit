import { Link } from "react-router-dom";
import "../UI/css/HomeCollectionsBanner.css";
import leftTravelImage from "../../assets/womanOnBalcony.png";
import rightTravelImage from "../../assets/womanOnMove.png";

export default function HomeCollectionsBanner() {
  return (
    <section className="collections-banner-section">
      <div className="collections-banner-top">
        <div className="collections-banner-image-wrap">
          <img
            src={leftTravelImage}
            alt="Travel collection"
            className="collections-banner-image"
          />
        </div>

        <div className="collections-banner-center">
          <div className="collections-banner-center-inner">
            <h2 className="collections-banner-title">Travel Smarter With Us</h2>
            <p className="collections-banner-eyebrow">
              Where will you go next?
            </p>
            <Link to="/products" className="collections-banner-link">
              SHOP NOW
            </Link>
          </div>
        </div>

        <div className="collections-banner-image-wrap">
          <img
            src={rightTravelImage}
            alt="Luggage collection"
            className="collections-banner-image second-image"
          />
        </div>
      </div>

      <div className="collections-sale-banner">
        <div className="collections-sale-inner">
          <p className="collections-sale-eyebrow">
            Final boarding call: clearance
          </p>

          <h3 className="collections-sale-title">Up to 50% off</h3>

          <Link to="/products" className="collections-sale-button">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
}
