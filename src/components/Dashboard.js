import React, { useState, useContext } from 'react';
import { WalletContext } from '../context/WalletContext';

const Dashboard = () => {
  const [view, setView] = useState('home');
  const [currency, setCurrency] = useState('NGN'); // NGN or USD
  const { balances } = useContext(WalletContext);

  const currencyValue = currency === 'NGN' ? `₦${balances.nairaBalance.toFixed(2)}` : `$${balances.dollarBalance.toFixed(2)}`;

  return (
    <div className="dashboard">
      <div className="hero">
        <div className="currency-display">
          <span className="currency-label">Balance:</span>
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
        {view === 'home' && <p>Welcome to your LINSFAIR home dashboard. Your Naira Balance: ₦{balances.nairaBalance.toFixed(2)}, Dollar Balance: ${balances.dollarBalance.toFixed(2)}</p>}
        {view === 'save' && <p>Track your savings goals here.</p>}
        {view === 'invest' && <p>Investment opportunities and portfolio.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
