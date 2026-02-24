import React, { useState, useEffect, useContext, useCallback } from 'react';
import { WalletContext } from '../context/WalletContext';
import './SafetyLock.css';

const SafetyLock = () => {
    const { fetchLocks, fetchLockRequests, createLock, requestUnlock, approveUnlock, releaseLock } = useContext(WalletContext);
    const [locks, setLocks] = useState([]);
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'NGN',
        purpose: '',
        dueDate: '',
        guardianUsername: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const locksData = await fetchLocks();
            const requestsData = await fetchLockRequests();
            setLocks(locksData);
            setRequests(requestsData);
        } catch (err) {
            console.error(err);
        }
    }, [fetchLocks, fetchLockRequests]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreateLock = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await createLock(formData);
            setMessage({ text: 'Funds locked successfully!', type: 'success' });
            setFormData({ amount: '', currency: 'NGN', purpose: '', dueDate: '', guardianUsername: '' });
            loadData();
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Failed to lock funds', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, actionType, actionValue) => {
        try {
            if (actionType === 'request') await requestUnlock(id);
            if (actionType === 'approve') await approveUnlock(id, actionValue);
            if (actionType === 'release') await releaseLock(id);
            loadData();
        } catch (err) {
            setMessage({ text: err.response?.data?.error || 'Action failed', type: 'error' });
        }
    };

    return (
        <div className="safetylock-container">
            <h2>🛡️ Sapa Safety Lock</h2>
            <p>Protect your future self from impulsive spending.</p>

            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

            <div className="lock-card">
                <h3>Lock New Funds</h3>
                <form onSubmit={handleCreateLock} className="form-grid">
                    <div className="form-group">
                        <label>Amount</label>
                        <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required placeholder="0.00" />
                    </div>
                    <div className="form-group">
                        <label>Currency</label>
                        <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                            <option value="NGN">Naira (NGN)</option>
                            <option value="USD">Dollar (USD)</option>
                        </select>
                    </div>
                    <div className="form-group full">
                        <label>Purpose (What are you saving for?)</label>
                        <input type="text" value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required placeholder="e.g. Rent, Course fees, Emergency fund" />
                    </div>
                    <div className="form-group">
                        <label>Unlock Date</label>
                        <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Guardian Username (He/She must approve early unlock)</label>
                        <input type="text" value={formData.guardianUsername} onChange={(e) => setFormData({ ...formData, guardianUsername: e.target.value })} required placeholder="friend_username" />
                    </div>
                    <button type="submit" className="lock-btn" disabled={loading}>
                        {loading ? 'Locking...' : 'Lock Funds Securely'}
                    </button>
                </form>
            </div>

            {requests.length > 0 && (
                <div className="request-card">
                    <h3>🚨 Guardian Requests</h3>
                    <p>The following users want to unlock their funds early. They need your approval!</p>
                    <ul className="lock-list">
                        {requests.map(req => (
                            <li key={req._id} className="lock-item">
                                <div className="lock-info">
                                    <h4>{req.owner.username}'s {req.currency === 'USD' ? '$' : '₦'}{req.amount}</h4>
                                    <p>Purpose: {req.purpose}</p>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleAction(req._id, 'approve', 'approve')} className="action-btn approve-btn">Approve</button>
                                    <button onClick={() => handleAction(req._id, 'approve', 'reject')} className="action-btn reject-btn">Reject</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="active-locks-card">
                <h3>Active Locks</h3>
                <ul className="lock-list">
                    {locks.map(lock => (
                        <li key={lock._id} className="lock-item">
                            <div className="lock-info">
                                <h4>{lock.currency === 'USD' ? '$' : '₦'}{lock.amount} for {lock.purpose}</h4>
                                <p>Guardian: {lock.guardian.username} • Due: {new Date(lock.dueDate).toLocaleDateString()}</p>
                                <div className="status-badge-container">
                                    <span className={`status ${lock.status}`}>{lock.status.replace('_', ' ')}</span>
                                    {lock.status === 'available' && <span className="matured-tag">MATURED</span>}
                                </div>
                            </div>
                            <div className="actions">
                                {lock.status === 'active' && (
                                    <button onClick={() => handleAction(lock._id, 'request')} className="action-btn request-btn">Request Early Unlock</button>
                                )}
                                {(lock.status === 'available' || (new Date() > new Date(lock.dueDate) && lock.status === 'active')) && (
                                    <button onClick={() => handleAction(lock._id, 'release')} className="action-btn release-btn">Unlock Now</button>
                                )}
                            </div>
                        </li>
                    ))}
                    {locks.length === 0 && <p>No active locks. Time to start saving!</p>}
                </ul>
            </div>
        </div>
    );
};

export default SafetyLock;
