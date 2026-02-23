import React, { useState, useContext } from 'react';
import axios from 'axios';
import { WalletContext } from '../context/WalletContext';

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('NGN');
  const [type, setType] = useState('income');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { fetchBalances } = useContext(WalletContext);

  const validate = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Amount must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/transactions', {
        amount: parseFloat(amount),
        currency,
        description,
        type,
      });
      setMessage('Transaction added successfully');
      fetchBalances(); // Refresh balances
      setDescription('');
      setAmount('');
      setCurrency('NGN');
      setType('income');
      setErrors({});
    } catch (err) {
      setMessage('Error adding transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && <span className="error" style={{color: 'red', fontSize: '0.8rem'}}>{errors.description}</span>}
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          {errors.amount && <span className="error" style={{color: 'red', fontSize: '0.8rem'}}>{errors.amount}</span>}
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="NGN">Naira (₦)</option>
            <option value="USD">Dollar ($)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
