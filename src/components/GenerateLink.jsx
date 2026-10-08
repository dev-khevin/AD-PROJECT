import React, { useEffect, useState } from "react";

function GenerateLink() {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setLink(`${window.location.origin}/send/${user.username}`);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. Please copy the link manually.');
    }
  };

  return (
    <div className="card">
      {link ? (
        <>
          <div className="link-box">
            <a href={link} target="_blank" rel="noreferrer">{link}</a>
          </div>
          <button className="btn btn-pink" style={{ width: '100%' }} onClick={handleCopy}>
            {copied ? 'copied! ✅' : 'copy link!'}
          </button>
        </>
      ) : (
        <p className="empty">Generating your link...</p>
      )}
    </div>
  );
}

export default GenerateLink;