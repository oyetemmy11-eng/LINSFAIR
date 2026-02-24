import React, { useState, useEffect, useContext, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';
import './BillPayment.css';

const BillPayment = () => {
    const { fetchBills, createBill, payBill } = useContext(WalletContext);
    const [bills, setBills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        currency: 'NGN',
        category: 'utility',
        dueDate: '',
        autoPay: false
    });
    const [loading, setLoading] = useState(false);

    const loadBills = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchBills();
            setBills(data);
        } catch (err) {
            console.error('Error loading bills:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchBills]);

    useEffect(() => {
        loadBills();
    }, [loadBills]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createBill(formData);
            setShowForm(false);
            setFormData({ title: '', amount: '', currency: 'NGN', category: 'utility', dueDate: '', autoPay: false });
            loadBills();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add bill');
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (id) => {
        try {
            await payBill(id);
            loadBills();
        } catch (err) {
            alert(err.response?.data?.error || 'Payment failed');
        }
    };

    return (
        <div className="bill-container">
            <div className="section-header">
                <h2>🧾 Bill Payments</h2>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Bill'}
                </button>
            </div>

            {showForm && (
                <form className="bill-form glass-card" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Bill Name</label>
                            <input type="text" placeholder="e.g. Electricity" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                <option value="utility">Utility</option>
                                <option value="mobile">Mobile</option>
                                <option value="internet">Internet</option>
                                <option value="subscription">Subscription</option>
                                <option value="rent">Rent</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                                <option value="NGN">NGN (₦)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
                        </div>
                    </div>
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.autoPay}
                                onChange={(e) => setFormData({ ...formData, autoPay: e.target.checked })}
                            />
                            Enable Auto-Pay
                        </label>
                        <span className="help-text">Bill will be paid automatically on due date if balance is sufficient.</span>
                    </div>
                    <button type="submit" className="add-bill-btn" disabled={loading}>Track Bill</button>
                </form>
            )}

            <div className="bill-grid">
                {bills.map(bill => (
                    <div key={bill._id} className={`bill-card glass-card ${bill.status}`}>
                        <div className="bill-header">
                            <div>
                                <h4>{bill.title}</h4>
                                <span className="category-tag">{bill.category}</span>
                                {bill.autoPay && <span className="auto-pay-badge">AUTO-PAY</span>}
                            </div>
                            <span className={`status-tag ${bill.status}`}>{bill.status.toUpperCase()}</span>
                        </div>
                        <div className="bill-info">
                            <p className="due-date">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bill-amount-section">
                            <div className="amount num-font">{bill.currency === 'USD' ? '$' : '₦'}{bill.amount}</div>
                            {bill.status === 'pending' ? (
                                <button className="pay-btn" onClick={() => handlePay(bill._id)}>Pay Now</button>
                            ) : (
                                <div className="paid-status">PAID ✅</div>
                            )}
                        </div>
                    </div>
                ))}
                {bills.length === 0 && <p className="empty">No bills tracked yet.</p>}
            </div>
        </div>
    );
};

export default BillPayment;
