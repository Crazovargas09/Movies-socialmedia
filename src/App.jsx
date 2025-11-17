import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './basededatos/conexion';
import { collection, getDocs } from 'firebase/firestore';
import Login from './basededatos/Login.jsx';
import SignUp from './basededatos/Signup.jsx';
import CreatePost from './basededatos/createpost.jsx';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const loadedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(loadedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>CineTribe 🎬</h1>
          <p>Share your opinion about your favorite movie with others</p>
          <nav className="nav-links">
            {!user ? (
              <>
                <Link to="/login" className="btn-superior-derecho">Log in</Link>
                <Link to="/signup" className="btn-superior-izquierdo">Sign up</Link>
              </>
            ) : (
              <div className="user-session">
                <p>Welcome back, {user.email}!</p>
                <button onClick={() => signOut(auth)} className="logout-button">Log out</button>
              </div>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <section className="feed">
              {user && <CreatePost />}
              <h2>Latest Posts</h2>
              {posts.length === 0 ? (
                <p>No posts yet</p>
              ) : (
                posts.map((p) => (
                  <div key={p.id} className="post-card">
                    <img src={p.imageUrl} alt="Movie" className="post-image" />
                    <p>{p.text}</p>
                    <span>Publicado por: {p.userEmail}</span>
                  </div>
                ))
              )}
            </section>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;