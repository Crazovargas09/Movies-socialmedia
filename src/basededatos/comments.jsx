import { useState, useEffect } from "react";
import { db, auth } from "./conexion";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

function Comments({ postId }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [postId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!auth.currentUser) {
      return alert("Debes estar logueado para comentar.");
    }

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: commentText,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      createdAt: new Date()
    });

    setCommentText("");
  };

  return (
    <div className="comments">
      <form onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Comentar</button>
      </form>

      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.userEmail}</strong>: {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Comments;