import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posted, setPosted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, []);

  const uploadToImgbb = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=443da00699351a8bb1be454e173b3ed9`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !currentUser) return;

    setUploading(true);
    let imageUrl = '';
    if (imageFile) {
      try {
        imageUrl = await uploadToImgbb(imageFile);
      } catch (err) {
        alert('Image upload failed.');
        setUploading(false);
        return;
      }
    }

    await addDoc(collection(db, 'Projects'), {
      name,
      description,
      image: imageUrl,
      author: currentUser.displayName,
      authorAvatar: currentUser.photoURL,
      createdAt: serverTimestamp(),
      ownerId: currentUser.uid,
    });
    setPosted(true);
    setUploading(false);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div className="create-project-page">
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ marginBottom: 16 }}
      >
        ← Back to Home
      </button>
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <label>
          Project Name:
          <input value={name} onChange={e => setName(e.target.value)} required disabled={posted || uploading} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={e => setDescription(e.target.value)} required disabled={posted || uploading} />
        </label>
        <label>
          Project Image (optional):
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
            disabled={posted || uploading}
          />
        </label>
        <button type="submit" disabled={!currentUser || posted || uploading} style={{ minWidth: 80 }}>
          {uploading ? 'Uploading...' : posted ? '✔️' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;