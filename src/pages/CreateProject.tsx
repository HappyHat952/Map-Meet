import React, { useState } from 'react';
import './CreateProject.css';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<null | {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }>(null);
  const [posted, setPosted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
    });
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
      author: currentUser?.displayName || '',
      authorAvatar: currentUser?.photoURL || '',
      createdAt: serverTimestamp(),
      ownerId: currentUser?.uid || '',
    });
    setPosted(true);
    setUploading(false);
    setTimeout(() => navigate('/'), 1200);
  };

  // Show image preview when file is selected
  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  return (
    <div className="create-project-page">
      <button type="button" onClick={() => navigate('/')}>← Back to Home</button>
      <h2>Create a New Project</h2>
      <form onSubmit={handleSubmit} className="create-project-form">
        <label>
          Project Name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={posted || uploading}
            placeholder="Enter project name"
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            disabled={posted || uploading}
            placeholder="Describe your project..."
          />
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
        {imagePreview && (
          <div style={{ textAlign: 'center', margin: '8px 0' }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 10, boxShadow: '0 2px 8px #cbd5e1' }}
            />
          </div>
        )}
        <button type="submit" disabled={!currentUser || posted || uploading}>
          {uploading ? 'Uploading...' : posted ? '✔️' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;