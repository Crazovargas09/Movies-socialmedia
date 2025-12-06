import { useState } from "react";
import { db, auth } from "./conexion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !text) {
      return alert("Debes subir una imagen y escribir algo.");
    }

    if (!auth.currentUser) {
      return alert("Debes iniciar sesión para publicar.");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      const imageUrl = data.imageUrl;

      await addDoc(collection(db, "posts"), {
        text,
        imageUrl,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      setText("");
      setImage(null);
      alert("¡Post creado con éxito!");
    } catch (error) {
      console.error("Error al crear el post:", error);
      alert("Hubo un problema al subir el post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2>Crear nuevo post</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <textarea
        placeholder="write your opinion..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Publish"}
      </button>
    </form>
  );
}

export default CreatePost;
