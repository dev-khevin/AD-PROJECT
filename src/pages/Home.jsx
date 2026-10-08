import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerateLink from '../components/GenerateLink';
import Message from '../components/Message';

function Home() {
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState('User');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3001/api/user/${storedUser.userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then((data) => setUsername(data.username))
      .catch(() => setUsername(storedUser.username || 'User'));
  }, [navigate]);

  return (
    <div className="page">
      <div className="hero">
        <h1>{greeting}, {username}!</h1>
        <p>get anonymous messages from your friends 🤫</p>
      </div>

      <div className="step">Step 1: copy your link</div>
      <GenerateLink />

      <div className="step">Step 2: share it on your story</div>
      <div className="tile-row">
        <button className="tile" onClick={() => navigate('/inbox')}><span>📥</span>Inbox</button>
        <button className="tile" onClick={() => navigate('/profile')}><span>👤</span>Profile</button>
      </div>

      <button className="link-btn" onClick={() => setShowMessage(!showMessage)}>
        {showMessage ? 'hide' : 'send a message to someone else'}
      </button>
      {showMessage && <Message />}
    </div>
  );
}

export default Home;