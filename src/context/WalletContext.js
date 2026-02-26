import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [balances, setBalances] = useState({ nairaBalance: 0, dollarBalance: 0 });

  const fetchBalances = useCallback(async () => {
    try {
      const res = await api.get('/wallet');
      setBalances(res.data);
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  }, []);

  const updateBalances = useCallback(async (newBalances) => {
    try {
      const res = await api.put('/wallet', newBalances);
      setBalances(res.data);
    } catch (err) {
      console.error('Error updating balances:', err);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchBalances();
    }
  }, [token, fetchBalances]);

  const fetchLocks = useCallback(async () => {
    try {
      const res = await api.get('/locks');
      return res.data;
    } catch {
      return [];
    }
  }, []);

  const fetchLockRequests = useCallback(async () => {
    try {
      const res = await api.get('/locks/requests');
      return res.data;
    } catch {
      return [];
    }
  }, []);

  const createLock = useCallback(async (lockData) => {
    await api.post('/locks', lockData);
    fetchBalances();
  }, [fetchBalances]);

  const requestUnlock = useCallback(async (id) => {
    await api.post(`/locks/${id}/request`);
  }, []);

  const approveUnlock = useCallback(async (id, action) => {
    await api.post(`/locks/${id}/approve`, { action });
    fetchBalances();
  }, [fetchBalances]);

  const releaseLock = useCallback(async (id) => {
    await api.post(`/locks/${id}/release`);
    fetchBalances();
  }, [fetchBalances]);

  const fetchBills = useCallback(async () => {
    try {
      const res = await api.get('/bills');
      return res.data;
    } catch {
      return [];
    }
  }, []);

  const createBill = useCallback(async (billData) => {
    await api.post('/bills', billData);
  }, []);

  const payBill = useCallback(async (id) => {
    await api.post(`/bills/${id}/pay`);
    fetchBalances();
  }, [fetchBalances]);

  const fetchSavingsPlans = useCallback(async () => {
    try {
      const res = await api.get('/savings');
      return res.data;
    } catch {
      return [];
    }
  }, []);

  const createSavingsPlan = useCallback(async (planData) => {
    await api.post('/savings', planData);
  }, []);

  const contributeToSavings = useCallback(async (id, amount) => {
    await api.post(`/savings/${id}/contribute`, { amount });
    fetchBalances();
  }, [fetchBalances]);

  const value = useMemo(() => ({
    balances,
    fetchBalances,
    updateBalances,
    fetchLocks,
    fetchLockRequests,
    createLock,
    requestUnlock,
    approveUnlock,
    releaseLock,
    fetchBills,
    createBill,
    payBill,
    fetchSavingsPlans,
    createSavingsPlan,
    contributeToSavings
  }), [
    balances,
    fetchBalances,
    updateBalances,
    fetchLocks,
    fetchLockRequests,
    createLock,
    requestUnlock,
    approveUnlock,
    releaseLock,
    fetchBills,
    createBill,
    payBill,
    fetchSavingsPlans,
    createSavingsPlan,
    contributeToSavings
  ]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
