import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './conexion';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User registered successfully');
      navigate('/');
    } catch (error) {
      alert('Error sign up: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>CREATE ACCOUNT</h2>

        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-input"
          />

          <button type="submit" className="signup-button">
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
