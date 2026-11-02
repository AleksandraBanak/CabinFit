import './ServiceBenefits.css'; 

import { FaShippingFast, FaCreditCard, FaHourglassHalf, FaUndo, FaCheckSquare } from 'react-icons/fa';

const ServiceBenefits = () => {
  const benefits = [
    {
      icon: <FaShippingFast />,
      title: 'Free Shipping Over $50',
      description: 'Free shipping for orders over $50, delivered within 3-5 business days across North Macedonia.',
    },
    {
      icon: <FaCreditCard />,
      title: 'Secure Online Payments',
      description: 'Safe and secure online payments and protection of your data.',
    },
    {
      icon: <FaHourglassHalf />,
      title: 'Delivery within 24 Hours',
      description: 'Possibility of delivery within 24 hours.',
    },
    {
      icon: <FaUndo />,
      title: 'Returns within 15 Days',
      description: 'Product exchange within 15 business days, with the possibility of a refund.',
    },
    {
      icon: <FaCheckSquare />,
      title: 'Guaranteed Quality',
      description: 'Verified stock and availability of products.',
    },
  ];

  return (
    <div className="service-benefits-section mt-5 ">
      <div className="container ">
        <div className="row justify-content-center">
          {benefits.map((benefit, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-sm-6 benefit-item text-center mb-4">
              <div className="benefit-icon mb-3">
                {benefit.icon}
              </div>
              <h5 className="benefit-title">{benefit.title}</h5>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceBenefits;