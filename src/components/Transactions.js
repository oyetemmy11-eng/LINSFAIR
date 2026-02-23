import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '', currency: 'NGN', type: 'income' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      setMessage('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

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
      await axios.put(`http://localhost:5000/api/transactions/${editing}`, editForm);
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
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        setMessage('Transaction deleted successfully');
        fetchTransactions();
      } catch (err) {
        setMessage('Error deleting transaction');
      }
    }
  };

  return (
    <div className="transactions">
      <h2>Transactions</h2>
      {message && <div className="message">{message}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx) => (
            <li key={tx._id} className="transaction-item">
              {editing === tx._id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    required
                  />
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                  >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                  </select>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                </form>
              ) : (
                <div className="transaction-details">
                  <span>{tx.description} - {tx.currency === 'NGN' ? '₦' : '$'}{tx.amount} ({tx.type})</span>
                  <div className="actions">
                    <button onClick={() => handleEdit(tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx._id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;
