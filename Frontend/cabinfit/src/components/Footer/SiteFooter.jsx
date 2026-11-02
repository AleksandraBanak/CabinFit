import { Phone, Mail, Truck, ShieldCheck, BaggageClaim } from "lucide-react";
import "./SiteFooter.css";
import storeImage from "../../assets/Store.png";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container product-details-container">
        <div className="footer-top d-flex justify-content-between align-items-stretch pb-5">
          <div className="footer-left">
            <span className="footer-eyebrow">CAN WE HELP?</span>
            <h3>Please get in touch by phone or email</h3>
          </div>

          <div className="footer-right d-flex align-items-end gap-4">
            <a href="tel:+38976278261" className="footer-contact">
              <Phone size={20} />
              <span>+389 76 278 261</span>
            </a>

            <a
              href="mailto:clientservice@cabinfit.com"
              className="footer-contact"
            >
              <Mail size={20} />
              <span>Client Service</span>
            </a>
          </div>
        </div>

        <div className="footer-divider my-2" />

        <div className="row footer-middle py-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <span className="footer-eyebrow">TRAVEL ESSENTIALS</span>
            <h4 className="footer-heading mb-3">Designed for every journey</h4>

            <p className="footer-text">
              Discover thoughtfully selected luggage and travel bags made to
              combine style, comfort, and practicality for every trip.
            </p>

            <div className="d-flex gap-3 mt-4">
              <div className="footer-feature-item">
                <Truck size={18} />
                <span>Fast and reliable delivery</span>
              </div>

              <div className="footer-feature-item">
                <ShieldCheck size={18} />
                <span>Carefully selected quality products</span>
              </div>

              <div className="footer-feature-item">
                <BaggageClaim size={18} />
                <span>Cabin-friendly and travel-ready options</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5 ms-auto">
            <div className="footer-store-card">
              <p className="footer-store-title">
                We are not far away! Visit us in store.
              </p>

              <div className="footer-store-layout">
                <div className="footer-store-image">
                  <img src={storeImage} alt="CabinFit store" />
                </div>

                <div className="footer-store-info">
                  <span className="footer-eyebrow footer-store-label">find our store</span>

                  <p className="footer-store-name">CabinFit Skopje - Centar</p>
                  <p className="muted">Sv. Kiril i Metodij 15</p>
                  <p>1000 Skopje</p>
                  <p>+389 76 278 261</p>
                  <p>Macedonia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider my-4" />

        <div className="footer-bottom text-center text-md-start pt-3">
          <p>© {new Date().getFullYear()} CabinFit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
