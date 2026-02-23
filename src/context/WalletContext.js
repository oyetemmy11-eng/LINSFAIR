import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [balances, setBalances] = useState({ nairaBalance: 0, dollarBalance: 0 });

  useEffect(() => {
    if (token) {
      fetchBalances();
    }
  }, [token]);

  const fetchBalances = async () => {
    const res = await axios.get('http://localhost:5000/api/wallet');
    setBalances(res.data);
  };

  const updateBalances = async (newBalances) => {
    const res = await axios.put('http://localhost:5000/api/wallet', newBalances);
    setBalances(res.data);
  };

  return (
    <WalletContext.Provider value={{ balances, fetchBalances, updateBalances }}>
      {children}
    </WalletContext.Provider>
  );
};