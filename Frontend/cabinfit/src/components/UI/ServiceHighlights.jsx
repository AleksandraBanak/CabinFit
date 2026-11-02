import { BadgeCheck, Infinity, Headset } from "lucide-react";
import "../UI/css/ServiceHighlights.css";

export default function ServiceHighlights() {
  return (
    <section className="service-highlights mt-4">
      <div className="container service-highlights-container">
        <div className="service-highlights-grid text-uppercase">
          <div className="service-item">
            <div className="service-icon-wrap">
              <BadgeCheck size={34} strokeWidth={1.5} />
            </div>
            <h4 className="highlights-title">Designed with quality</h4>
            <p>Each item is quality tested and carefully inspected</p>
          </div>

          <div className="service-item">
            <div className="service-icon-wrap">
              <Infinity size={34} strokeWidth={1.5} />
            </div>
            <h4 className="highlights-title">Lifetime guarantee</h4>
            <p>Long-term support with repairs for any functional issues</p>
          </div>

          <div className="service-item">
            <div className="service-icon-wrap">
              <Headset size={34} strokeWidth={1.5} />
            </div>
            <h4 className="highlights-title">Customer service</h4>
            <p>A dedicated support team is always ready to assist you</p>
          </div>
        </div>
      </div>
    </section>
  );
}
