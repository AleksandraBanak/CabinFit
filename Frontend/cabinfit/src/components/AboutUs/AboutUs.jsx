import { Link } from "react-router-dom";
import { ShieldCheck, Plane, ShoppingBag, HeartHandshake } from "lucide-react";
import aboutUsImg from "../../assets/HomeBackround.png";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="about-page">
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(10,18,24,0.35), rgba(10,18,24,0.35)), url(${aboutUsImg})`,
        }}
      >
        <div className="about-hero-overlay">
          <p className="about-eyebrow">About CabinFit</p>
          <h1>Travel smarter, pack better.</h1>
          <p className="about-hero-text">
            At CabinFit, we help travelers find luggage and travel bags that fit
            airline size requirements without sacrificing style, quality, or
            convenience.
          </p>
        </div>
      </section>

      <section className="about-intro container">
        <div className="about-intro-grid">
          <div className="about-intro-left">
            <p className="about-section-label">Our Story</p>
            <h2>Built for modern travelers</h2>
          </div>

          <div className="about-intro-right">
            <p>
              CabinFit was created to make travel shopping easier. Choosing the
              right suitcase should not feel confusing or stressful. We wanted
              to build a store where customers can quickly find luggage that
              matches airline requirements, personal style, and everyday travel
              needs.
            </p>
            <p>
              From compact underseat bags to spacious checked luggage, our goal
              is to offer practical, well-designed options that help you travel
              with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <p className="about-section-label center">Why Choose Us</p>
          <h2 className="about-section-title center">
            What makes CabinFit different
          </h2>

          <div className="about-cards">
            <div className="about-card">
              <div className="about-card-icon">
                <Plane size={28} />
              </div>
              <h3>Airline-focused shopping</h3>
              <p>
                We make it easier to shop based on size categories that reflect
                real travel needs, from underseat to checked luggage.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Quality you can trust</h3>
              <p>
                We focus on luggage that combines durability, function, and
                clean design for reliable travel experiences.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">
                <ShoppingBag size={28} />
              </div>
              <h3>Simple shopping experience</h3>
              <p>
                Easy browsing, helpful filters, and clear product details help
                you find what you need faster.
              </p>
            </div>

            <div className="about-card">
              <div className="about-card-icon">
                <HeartHandshake size={28} />
              </div>
              <h3>Customer-first mindset</h3>
              <p>
                We believe great travel starts before the trip, with products
                and service that customers can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission container">
        <div className="about-mission-box">
          <div className="about-mission-content">
            <p className="about-section-label">Our Mission</p>
            <h2 className="pb-1">
              To make travel preparation feel effortless.
            </h2>
            <p className="pt-2">
              We want every customer to feel confident that the bag they choose
              is the right one for their journey. CabinFit is about combining
              practicality with style, so your luggage works as well as it
              looks. From short weekend trips to long-haul travel, our products
              are designed to adapt to your needs. We focus on functionality,
              durability, and thoughtful design details that make every journey
              smoother.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta container">
        <div className="about-cta-box">
          <p className="about-section-label explore">Explore CabinFit</p>
          <div className="about-cta-inner">
            <div>
              <h2>Ready to find your next travel companion?</h2>
            </div>

            <div className="about-cta-actions">
              <Link to="/products" className="about-btn about-btn-dark">
                View Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
