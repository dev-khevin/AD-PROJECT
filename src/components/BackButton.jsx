import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton({ to = '/' }) {
  const navigate = useNavigate();
  return (
    <button className="back-btn" onClick={() => navigate(to)}>
      ← Back
    </button>
  );
}

export default BackButton;