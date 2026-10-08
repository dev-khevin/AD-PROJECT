import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import "./App.css";

import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/login';
import Register from './pages/Register';
import Inbox from './components/Inbox';
import Message from './components/Message';

function NavBar() {
  const location = useLocation(); // re-checks login every time the page changes
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  const hiddenOn = ['/login', '/register'];
  if (!user || !user.userId || hiddenOn.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Ngilo</span>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/inbox">Inbox</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="navbar-logout">Log Out</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/send/:recipient" element={<Message />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;