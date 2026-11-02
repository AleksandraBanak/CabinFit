import { Link } from "react-router-dom";
import "../UI/css/HomePromoPanel.css";
import homeSuitcase from "../../assets/complet2.png";
import manHoldingSuitcase from "../../assets/manHoldingSuitcase.png";
import whiteSuitcaseGirl from "../../assets/whiteSuitcaseGirl.png";

const promoItems = [
  {
    title: "Global Carry-Ons",
    subtitle: "Breeze through airports with ease",
    image: homeSuitcase,
    link: "/products",
  },
  {
    title: "Lightweight",
    subtitle: "Skip overweight baggage fees",
    image: manHoldingSuitcase,
    link: "/products",
  },
  {
    title: "Better Than Basic",
    subtitle: "Functional, organized, and perfect for a quick getaway",
    image: whiteSuitcaseGirl,
    link: "/products",
  },
];

export default function HomePromoPanel() {
  return (
    <section className="home-promo-panel">
      <div className="home-promo-grid">
        {promoItems.map((item, index) => (
          <article className="home-promo-card" key={index}>
            <Link to={item.link} className="home-promo-image-link">
              <div className="home-promo-image-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`home-promo-image ${index === 2 ? "third-image" : ""}`}
                />
              </div>
            </Link>

            <div className="home-promo-content">
              <h3 className="home-promo-title">{item.title}</h3>
              <p className="home-promo-subtitle">{item.subtitle}</p>

              <Link to={item.link} className="home-promo-link">
                SHOP NOW
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
