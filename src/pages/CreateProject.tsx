import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [posted, setPosted] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !currentUser) return;
    await addDoc(collection(db, 'projects'), {
      name,
      description,
      image,
      author: currentUser.displayName,
      authorAvatar: currentUser.photoURL,
      createdAt: serverTimestamp(),
      ownerId: currentUser.uid,
    });
    setPosted(true);
    setTimeout(() => navigate('/'), 1200); // Wait so checkmark is visible
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
          <input value={name} onChange={e => setName(e.target.value)} required disabled={posted} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={e => setDescription(e.target.value)} required disabled={posted} />
        </label>
        <label>
          Image URL (optional):
          <input value={image} onChange={e => setImage(e.target.value)} disabled={posted} />
        </label>
        <button type="submit" disabled={!currentUser || posted} style={{ minWidth: 80 }}>
          {posted ? '✔️' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;