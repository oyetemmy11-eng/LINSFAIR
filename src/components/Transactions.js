import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../api/api';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '', currency: 'NGN', type: 'income' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState({ type: 'all', currency: 'all' });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      setMessage('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleEdit = (tx) => {
    setEditing(tx._id);
    setEditForm({
      description: tx.description,
      amount: tx.amount,
      currency: tx.currency,
      type: tx.type,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/transactions/${editing}`, editForm);
      setMessage('Transaction updated successfully');
      setEditing(null);
      fetchTransactions();
    } catch (err) {
      setMessage('Error updating transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        setMessage('Transaction deleted successfully');
        fetchTransactions();
      } catch (err) {
        setMessage('Error deleting transaction');
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const typeMatch = filter.type === 'all' || tx.type === filter.type;
      const currencyMatch = filter.currency === 'all' || tx.currency === filter.currency;
      return typeMatch && currencyMatch;
    });
  }, [transactions, filter]);

  return (
    <div className="transactions-container">
      <div className="section-header">
        <h2>📋 Activity History</h2>
        <div className="filters">
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filter.currency} onChange={(e) => setFilter({ ...filter, currency: e.target.value })}>
            <option value="all">All Currencies</option>
            <option value="NGN">NGN (₦)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      {loading ? (
        <div className="loading">SYNCING DATA...</div>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map((tx) => (
            <div key={tx._id} className={`transaction-item glass-card ${tx.type}`}>
              {editing === tx._id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="form-grid">
                    <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
                    <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} required />
                    <select value={editForm.currency} onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}>
                      <option value="NGN">NGN</option>
                      <option value="USD">USD</option>
                    </select>
                    <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">Save</button>
                    <button type="button" className="btn-cancel" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="tx-content">
                  <div className="tx-icon">
                    {tx.type === 'income' ? '↙️' : '↗️'}
                  </div>
                  <div className="tx-main">
                    <div className="tx-info">
                      <span className="tx-desc">{tx.description}</span>
                      <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                    <div className={`tx-amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'} {tx.currency === 'NGN' ? '₦' : '$'}{tx.amount.toLocaleString()}
                    </div>
                  </div>
                  <div className="tx-actions">
                    <button className="icon-btn edit" onClick={() => handleEdit(tx)}>✎</button>
                    <button className="icon-btn delete" onClick={() => handleDelete(tx._id)}>🗑</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredTransactions.length === 0 && <p className="empty">No activity found.</p>}
        </div>
      )}
    </div>
  );
};

export default Transactions;
