# CineTribe – Movies Social Media

Small social app to share movie opinions.

Stack:

- React + React Router
- Firebase Authentication + Firestore
- Node (Express) server for uploading images to a local folder

---

## Requirements

- Node.js 18+ installed
- Firebase project created (to use Auth and Firestore)
- Modern browser (Chrome, Edge, etc.)

---

## Project Structure

```bash
Movies-socialmedia/
├─ package.json
├─ server.mjs          # Node server for image uploads
├─ uploads/            # Local folder where images are stored
└─ src/
   ├─ App.jsx
   ├─ App.css
   ├─ main.jsx
   ├─ index.css
   └─ basededatos/
      ├─ conexion.js   # Firebase configuration (auth + db)
      ├─ createpost.jsx
      ├─ Login.jsx
      └─ Signup.jsx
```

Important: `uploads/` must be in the project root, at the same level as `package.json` and `server.mjs`, not inside `src`.

---

## 1. Install Dependencies

From the project root:

```bash
cd Movies-socialmedia

# Frontend dependencies
npm install

# Backend (image server) dependencies
npm install express cors multer
```

---

## 2. Configure Firebase (`conexion.js`)

File: `src/basededatos/conexion.js`

Example:

```js
// src/basededatos/conexion.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

Replace the configuration values with those from your Firebase project.

---

## 3. Create the `uploads` Folder

From the project root:

```bash
mkdir uploads
```

This folder is where the Node server will store uploaded images.

---

## 4. Image Upload Server (`server.mjs`)

File: `server.mjs` in the project root:

```js
// server.mjs
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file received." });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  return res.json({ imageUrl });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});
```

This server:

- Accepts `POST /upload` with a form-data field named `image`.
- Saves the file into the `uploads/` folder.
- Returns a JSON object with `imageUrl`, e.g. `http://localhost:4000/uploads/filename.jpg`.

---

## 5. Frontend: CreatePost Component (summary)

File: `src/basededatos/createpost.jsx`

Key points:

- Uses a `<form>` with a file input and a textarea.
- On submit, it:

  - Sends the selected file to `http://localhost:4000/upload` via `fetch` and `FormData`.
  - Receives `imageUrl` from the Node server.
  - Stores a document in Firestore (`posts` collection) with `text`, `imageUrl`, `userId`, `userEmail`, and `createdAt`.

Example implementation:

```jsx
// src/basededatos/createpost.jsx
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
      return alert("You must upload an image and write something.");
    }

    if (!auth.currentUser) {
      return alert("You must be logged in to publish.");
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
        throw new Error(data.error || "Error uploading image");
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
      alert("Post created successfully.");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("There was a problem uploading the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2>Create new post</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <textarea
        placeholder="Write your opinion..."
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
```

---

## 6. Frontend: Displaying Posts (App.jsx summary)

`App.jsx` listens to changes in the `posts` collection using Firestore `onSnapshot` and renders them under "Latest Posts".

Key points:

- Uses `onAuthStateChanged` to track the logged-in user.
- Uses `onSnapshot(query(collection(db, "posts"), orderBy("createdAt", "desc")))` to listen to posts.
- Renders `<CreatePost />` only when the user is logged in.
- Maps over `posts` to show `imageUrl`, `text`, and `userEmail`.

---

## 7. Run the Backend (Node Server)

From the project root:

```bash
node server.mjs
```

You should see:

```text
Upload server running on http://localhost:4000
```

Keep this process running while you use the app.

---

## 8. Run the Frontend (React App)

In another terminal, also from the project root:

```bash
npm run dev
```

If you are using Vite, it will typically run on `http://localhost:5173` (check the console output).

Open that URL in your browser.

---

## 9. Usage Flow

1. Open the frontend URL (for example `http://localhost:5173`).

2. Sign up or log in using the `Sign up` / `Log in` routes.

3. Once logged in, on the home route (`/`) you will see:

   - The "Create new post" form (file input + textarea).
   - The "Latest Posts" list.

4. To create a post:

   - Choose an image file.
   - Write some text.
   - Click "Publish".

5. Result:

   - The image is uploaded to the Node server and stored in `uploads/`.
   - A Firestore document is created in the `posts` collection.
   - The post appears in the "Latest Posts" list (real-time update via `onSnapshot`).

---

## 10. Common Issues

### Images do not load (404 on `/uploads/...`)

- Check that `node server.mjs` is running.
- Confirm that the `uploads/` folder is in the project root (not inside `src`).
- Ensure `app.use('/uploads', express.static(path.join(__dirname, 'uploads')));` is present in `server.mjs`.

### `auth` or `db` is undefined

- Verify that `conexion.js` exports `auth` and `db`.
- Check the import paths, for example:

  ```js
  import { auth, db } from "./basededatos/conexion";
  ```

### CORS errors

- Confirm that `app.use(cors());` is present in `server.mjs`.
- Check that the frontend is calling exactly `http://localhost:4000/upload`.

### Firestore permission errors

- In Firebase Console, check your Firestore security rules.
- For development, you can use permissive rules, but for production you should restrict them appropriately.
