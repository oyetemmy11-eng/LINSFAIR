import React, { useState, useEffect, useContext, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';
import './Savings.css';

const Savings = () => {
    const { fetchSavingsPlans, createSavingsPlan, contributeToSavings } = useContext(WalletContext);
    const [plans, setPlans] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currency: 'NGN',
        frequency: 'weekly',
        amountPerFrequency: '',
        nextContributionDate: ''
    });

    const [loading, setLoading] = useState(false);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSavingsPlans();
            setPlans(data);
        } catch (err) {
            console.error('Error loading plans:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchSavingsPlans]);

    useEffect(() => {
        loadPlans();
    }, [loadPlans]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSavingsPlan(formData);
            setShowForm(false);
            loadPlans();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create plan');
        }
    };

    const handleContribute = async (id, amount) => {
        try {
            await contributeToSavings(id, amount);
            loadPlans();
        } catch (err) {
            alert(err.response?.data?.error || 'Contribution failed');
        }
    };

    return (
        <div className="savings-container">
            <div className="section-header">
                <h2>💰 Automated Savings</h2>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Plan'}
                </button>
            </div>

            {showForm && (
                <form className="savings-form glass-card" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full">
                            <label>Plan Goal Name</label>
                            <input type="text" placeholder="e.g. New Laptop" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Target Amount</label>
                            <input type="number" placeholder="50000" value={formData.targetAmount} onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Frequency</label>
                            <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount per Cycle</label>
                            <input type="number" placeholder="1000" value={formData.amountPerFrequency} onChange={(e) => setFormData({ ...formData, amountPerFrequency: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Next Auto-Save Date</label>
                            <input type="date" value={formData.nextContributionDate} onChange={(e) => setFormData({ ...formData, nextContributionDate: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-submit">Start Saving</button>
                </form>
            )}

            <div className="plans-grid">
                {plans.map(plan => {
                    const progress = (plan.currentAmount / plan.targetAmount) * 100;
                    return (
                        <div key={plan._id} className="plan-card glass-card">
                            <div className="plan-header">
                                <h3>{plan.title}</h3>
                                <span className={`plan-status ${plan.status}`}>{plan.status}</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                            </div>
                            <div className="plan-details">
                                <span>{plan.currency === 'USD' ? '$' : '₦'}{plan.currentAmount.toLocaleString()} saved</span>
                                <span>Target: {plan.currency === 'USD' ? '$' : '₦'}{plan.targetAmount.toLocaleString()}</span>
                            </div>
                            <div className="plan-meta">
                                Saving {plan.currency === 'USD' ? '$' : '₦'}{plan.amountPerFrequency} {plan.frequency}
                            </div>
                            <button
                                className="btn-contribute"
                                onClick={() => handleContribute(plan._id, plan.amountPerFrequency)}
                                disabled={plan.status === 'completed'}
                            >
                                {plan.status === 'completed' ? 'Goal Reached!' : 'Top Up Now'}
                            </button>
                        </div>
                    );
                })}
                {plans.length === 0 && <p className="empty">No savings plans yet. Let's start one!</p>}
            </div>
        </div>
    );
};

export default Savings;
