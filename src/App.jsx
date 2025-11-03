import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './basededatos/Login.jsx';
import SignUp from './basededatos/Signup.jsx';

function App() {
  const [posts, setPosts] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>CineTribe 🎬</h1>
          <p>Share your opinion about your favorite movie with others</p>
          <nav className="nav-links">
            <Link to="/login" className="btn-superior-derecho">Log in</Link>
            <Link to="/signup" className="btn-superior-izquierdo">Sign up</Link>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <section className="feed">
                <h2>Latest Posts</h2>
                {posts.length === 0 ? (
                  <p>No posts yet</p>
                ) : (
                  posts.map((p, index) => (
                    <div key={index} className="post-card">
                      <p>{p.text}</p>
                      <span>{p.date}</span>
                    </div>
                  ))
                )}
              </section>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;