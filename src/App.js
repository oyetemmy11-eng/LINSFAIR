import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import AddTransaction from './components/AddTransaction';
import Login from './components/Login';
import { useContext } from 'react';

function AppContent() {
  const { token, logout } = useContext(AuthContext);

  if (!token) {
    return <Login />;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1 className="brand">LINSFAIR</h1>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/add">Add</Link></li>
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add" element={<AddTransaction />} />
          </Routes>
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
