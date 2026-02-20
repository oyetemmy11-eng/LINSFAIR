import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import AddTransaction from './components/AddTransaction';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1 className="brand">LINSFAIR</h1>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/add">Add</Link></li>
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

export default App;
