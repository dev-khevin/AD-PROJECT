import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));

    if (!stored || !stored.userId) {
      navigate('/login');
      return;
    }
    setUser(stored);

    fetch(`http://localhost:3001/api/inbox/${stored.userId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCount(data.length))
      .catch(() => setCount(null));
  }, [navigate]);

  if (!user) return null;

  const link = `${window.location.origin}/send/${user.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('Could not copy. Please copy the link manually.');
    }
  };

  return (
    <div className="page">
      <BackButton />

      <div className="card center">
        <div className="profile-avatar">{user.username[0].toUpperCase()}</div>
        <h2>@{user.username}</h2>

        <div className="stat">{count === null ? '...' : count}</div>
        <p className="empty" style={{ padding: 0, marginBottom: 20 }}>messages received</p>

        <div className="link-box">{link}</div>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Link'}</button>
          <button className="btn btn-ghost" onClick={() => navigate('/inbox')}>View Inbox</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;