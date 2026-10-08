import React, { useState } from "react";

function InsertLink({ onLinkValid }) {
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('');

  const extractRecipient = (value) => {
    const part = value.split('/send/')[1];
    return part ? part.split(/[/?#]/)[0].trim() : '';
  };

  const processLink = (value) => {
    setLink(value);
    setStatus('');

    const recipient = extractRecipient(value);

    if (value && !recipient) {
      setStatus("That doesn't look like a valid link.");
      return;
    }
    if (recipient && onLinkValid) {
      onLinkValid(recipient);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      processLink(text);
    } catch (error) {
      setStatus('Could not read from clipboard.');
      console.error('Clipboard read error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Insert Link</h2>

      <input
        type="text"
        placeholder="Paste recipient's link here (e.g., http://localhost:3000/send/maria)"
        value={link}
        onChange={(e) => processLink(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      <button onClick={handlePaste} style={{ padding: '10px 20px' }}>
        Paste from Clipboard
      </button>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  );
}

export default InsertLink;