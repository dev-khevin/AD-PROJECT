import React, { useCallback, useEffect, useState } from "react";
import BackButton from "./BackButton";

function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setStatus('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.userId) {
        setStatus('You need to be logged in to view your inbox.');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/inbox/${user.userId}`);
      const text = await res.text();

      if (!res.ok) {
        setStatus(`Error: ${text}`);
        return;
      }
      setMessages(JSON.parse(text));
    } catch (error) {
      setStatus('Error loading your messages. Please try again later.');
      console.error('Fetch inbox error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleCopy = async (msg) => {
    try {
      await navigator.clipboard.writeText(msg.message);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      alert('Could not copy this message.');
    }
  };

  // SQLite stores CURRENT_TIMESTAMP in UTC, so mark it as UTC before converting
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.replace(' ', 'T') + 'Z').toLocaleString();
  };

  return (
    <div className="page">
      <BackButton />

      <div className="hero hero-row">
        <div>
          <h1>Inbox</h1>
          <p>{messages.length} anonymous message{messages.length === 1 ? '' : 's'}</p>
        </div>
        <button className="small-btn" onClick={loadMessages} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {!loading && status && <p className="light">{status}</p>}

      {!loading && !status && messages.length === 0 && (
        <div className="card empty">
          No messages yet. Share your link to start receiving anonymous messages!
        </div>
      )}

      {messages.map((msg) => (
        <div className="msg-card" key={msg.id}>
          <div className="msg-top">anonymous message</div>
          <div className="msg-body">
            <p className="msg-text">{msg.message}</p>
            <span className="msg-date">{formatDate(msg.createdAt)}</span>
            <div className="msg-actions">
              <button className="small-btn" onClick={() => handleCopy(msg)}>
                {copiedId === msg.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Inbox;