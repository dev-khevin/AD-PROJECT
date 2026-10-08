import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3001/api/register', { username, password });
      alert('Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Server error. Please try again later.');
    }
  };

  return (
    <div>
      <div className='ngilo-user'>
        <div className='user-login'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button className='user-btn' type="submit">Sign Up</button>
          </form>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Link to="/login">Go Back to Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;