import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = ({ phoneNumber }) => {
  const handleClick = () => {
    const message = encodeURIComponent("Halo, saya ingin bertanya...");
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="whatsapp-button" onClick={handleClick}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
        alt="WhatsApp"
        className="whatsapp-icon"
      />
    </div>
  );
};

export default WhatsAppButton;
