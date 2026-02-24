import React, { useState, useContext, useEffect, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [currency, setCurrency] = useState('NGN');
  const { balances, fetchBalances, fetchBills, fetchSavingsPlans } = useContext(WalletContext);
  const [pendingBills, setPendingBills] = useState(0);
  const [activeSavings, setActiveSavings] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const [bills, plans] = await Promise.all([fetchBills(), fetchSavingsPlans()]);
      setPendingBills(bills.filter(b => b.status === 'pending').length);
      setActiveSavings(plans.filter(p => p.status === 'active').length);
    } catch (err) {
      console.error(err);
    }
  }, [fetchBills, fetchSavingsPlans]);

  useEffect(() => {
    fetchBalances();
    loadStats();
  }, [fetchBalances, loadStats]);

  const currentBalance = currency === 'NGN' ? balances.nairaBalance : balances.dollarBalance;
  const symbol = currency === 'NGN' ? '₦' : '$';

  return (
    <div className="dashboard">
      <div className="hero-section">
        <div className="balance-card glass-card">
          <div className="card-top">
            <span className="label">Available Balance</span>
            <div className="currency-selector">
              <button className={currency === 'NGN' ? 'active' : ''} onClick={() => setCurrency('NGN')}>NGN</button>
              <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>USD</button>
            </div>
          </div>
          <div className="balance-amount">
            <span className="symbol">{symbol}</span>
            <span className="value">{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="card-footer">
            <div className="account-tag">LINSFAIR PREMIUM</div>
            <div className="crypto-status">LIVE UPDATES ACTIVE</div>
          </div>
        </div>

        <div className="quick-stats">
          <Link to="/bills" className="stat-tile glass-card">
            <span className="icon">🧾</span>
            <div className="stat-info">
              <span className="count">{pendingBills}</span>
              <span className="label">Unpaid Bills</span>
            </div>
          </Link>
          <Link to="/savings" className="stat-tile glass-card">
            <span className="icon">💰</span>
            <div className="stat-info">
              <span className="count">{activeSavings}</span>
              <span className="label">Savings Plans</span>
            </div>
          </Link>
          <Link to="/safetylock" className="stat-tile glass-card featured">
            <span className="icon">🛡️</span>
            <div className="stat-info">
              <span className="label">Sapa Safety Lock</span>
              <span className="sub-label">Secure your future</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="actions-section">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <Link to="/add" className="action-item glass-card">
            <div className="action-icon">+</div>
            <span>Deposit</span>
          </Link>
          <button className="action-item glass-card disabled">
            <div className="action-icon">↑</div>
            <span>Send Money</span>
          </button>
          <button className="action-item glass-card disabled">
            <div className="action-icon">↓</div>
            <span>Receive</span>
          </button>
          <Link to="/transactions" className="action-item glass-card">
            <div className="action-icon">📋</div>
            <span>History</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
