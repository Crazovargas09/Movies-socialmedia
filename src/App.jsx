// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./basededatos/conexion";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Login from "./basededatos/Login.jsx";
import SignUp from "./basededatos/Signup.jsx";
import CreatePost from "./basededatos/createpost.jsx";
import "./App.css";

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
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const loadedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(loadedPosts);
      },
      (error) => {
        console.error("Error cargando posts:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <navBar/>
      <div className="navBar">
        <div className="logo-container">
          <img src="/public/logoCine.png" alt="Movie Icon" className="movie-icon"/>
        </div>
        <div className="title-navBar">
          <h1>MOVIECORN</h1>
        </div>
        <div className="buttons-navBar">
          {!user ? (
              <>
                <Link to="/login" className="btn-superior-derecho">
                  LOG IN
                </Link>
                <Link to="/signup" className="btn-superior-izquierdo">
                  SIGN UP
                </Link>
              </>
            ) : (
              <div className="user-session">
                <p>Hi {user.email}!</p>
                <button onClick={() => signOut(auth)} className="logout-button">
                  LOG OUT
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="app-container">
        <header className="header">
          <p>Share your opinion about your favorite movie with others</p>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <section className="feed">
                {user && <CreatePost />}
                <h2>LATEST POSTS</h2>

                {posts.length === 0 ? (
                  <p>No posts yet</p>
                ) : (
                  posts.map((p) => (
                    <div key={p.id} className="post-card">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt="Movie"
                          className="post-image"
                        />
                      )}
                      <p>{p.text}</p>
                      <span>Published by: {p.userEmail}</span>
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