import React, { useState } from 'react';

const Dashboard = () => {
  const [view, setView] = useState('home');
  const [currency, setCurrency] = useState('NGN'); // NGN or USD

  const currencyValue = currency === 'NGN' ? '₦0.00' : '$0.00';

  return (
    <div className="dashboard">
      <div className="hero">
        <div className="currency-display">
          <span className="currency-label">Preference:</span>
          <button
            className={`currency-btn ${currency === 'NGN' ? 'active' : ''}`}
            onClick={() => setCurrency('NGN')}
          >
            ₦
          </button>
          <button
            className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
            onClick={() => setCurrency('USD')}
          >
            $
          </button>
          <span className="currency-value">{currencyValue}</span>
        </div>
        <div className="tabs">
          {['home', 'save', 'invest'].map((tab) => (
            <button
              key={tab}
              className={`tab ${view === tab ? 'active' : ''}`}
              onClick={() => setView(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="view-content">
        {view === 'home' && <p>Welcome to your LINSFAIR home dashboard.</p>}
        {view === 'save' && <p>Track your savings goals here.</p>}
        {view === 'invest' && <p>Investment opportunities and portfolio.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
