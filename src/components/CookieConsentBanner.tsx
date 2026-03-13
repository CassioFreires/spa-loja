import { useState, useEffect } from 'react';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#18181b',
      color: '#fff',
      padding: '16px',
      textAlign: 'center',
      zIndex: 1000,
    }}>
      <p style={{ margin: 0, fontSize: '14px' }}>
        Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
      </p>
      <button
        onClick={handleAccept}
        style={{
          marginTop: '8px',
          padding: '8px 16px',
          backgroundColor: '#ca8a04',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Aceitar
      </button>
    </div>
  );
};

export default CookieConsentBanner;