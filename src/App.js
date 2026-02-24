import React, { useContext, lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard'));
const Transactions = lazy(() => import('./components/Transactions'));
const AddTransaction = lazy(() => import('./components/AddTransaction'));
const Login = lazy(() => import('./components/Login'));
const SafetyLock = lazy(() => import('./components/SafetyLock'));
const BillPayment = lazy(() => import('./components/BillPayment'));
const Savings = lazy(() => import('./components/Savings'));

function AppContent() {
  const { token, logout } = useContext(AuthContext);

  if (!token) {
    return (
      <Suspense fallback={<div className="loading-screen">INITIALIZING SECURITY...</div>}>
        <Login />
      </Suspense>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1 className="brand">LINSFAIR</h1>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/transactions">Activity</Link></li>
            <li><Link to="/bills">Bills</Link></li>
            <li><Link to="/savings">Savings</Link></li>
            <li><Link to="/safetylock">Safety Lock</Link></li>
            <li><Link to="/add">Add</Link></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>

        <main className="main-content">
          <Suspense fallback={<div className="loading-screen">LOADING MODULE...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/bills" element={<BillPayment />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/safetylock" element={<SafetyLock />} />
              <Route path="/add" element={<AddTransaction />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;
