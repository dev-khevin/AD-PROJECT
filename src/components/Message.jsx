import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import InsertLink from "./Insertlink";

function Message() {
  const { recipient: urlRecipient } = useParams();
  const [pastedRecipient, setPastedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const show = (text, error = false) => {
    setStatus(text);
    setIsError(error);
  };

  const handleSend = async () => {
    show('');
    try {
      const recipient = urlRecipient || pastedRecipient;

      if (!recipient || !message.trim()) {
        show('Please enter a valid recipient link and a message.', true);
        return;
      }

      const res = await fetch('http://localhost:3001/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        show(data.error || 'Something went wrong', true);
        return;
      }

      show('Sent! 🎉');
      setMessage('');
    } catch (error) {
      show('Error sending message. Please try again later.', true);
      console.error('Send message error:', error);
    }
  };

  // Public page: /send/maria (NGL style)
  if (urlRecipient) {
    return (
      <div className="page" style={{ paddingTop: 40 }}>
        <div className="ngl-card">
          <div className="ngl-head">
            <div className="ngl-avatar">{urlRecipient[0].toUpperCase()}</div>
            <div>
              <div className="ngl-user">@{urlRecipient}</div>
              <div className="ngl-sub">send me anonymous messages!</div>
            </div>
          </div>
          <textarea
            className="ngl-input"
            placeholder="send me anonymous messages.."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
        </div>

        <div className="ngl-lock">🔒 anonymous q&amp;a</div>

        <button className="ngl-send" onClick={handleSend} disabled={!message.trim()}>
          Send!
        </button>

        {status && <p className="ngl-status">{status}</p>}

        <Link className="ngl-get" to="/register">get your own link!</Link>
      </div>
    );
  }

  // Inside Home: a simple card
  return (
    <div className="card">
      <h2>Send Anonymous Message</h2>
      <InsertLink onLinkValid={setPastedRecipient} />
      <textarea
        className="msg-textarea"
        placeholder="Write something anonymous..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        maxLength={500}
      />
      <div className="char-count">{message.length}/500</div>
      <button className="btn" onClick={handleSend} disabled={!message.trim()}>Send!</button>
      {status && <p className={`status ${isError ? 'error' : ''}`}>{status}</p>}
    </div>
  );
}

export default Message;