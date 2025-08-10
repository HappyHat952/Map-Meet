import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import type { Project } from '../types';

// Local type for invites/requests
type Invite = {
  id: string;
  fromUser: { displayName: string; photoURL: string };
  projectId?: string;
  status?: string;
};
import './Home.css';

import { signInWithGoogleAndSaveProfile, auth, db } from '../firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import NotificationModal from './NotificationModal';



// ...existing code...
function Home() {
  const [firestoreProjects, setFirestoreProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState<Invite[]>([]); // Fetch from Firestore
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setInvites([]); // Clear invites when logged out
      return;         // Don't set up Firestore listener
    }
    const q = query(
      collection(db, "Invites"),
      where("toUserId", "==", currentUser.uid),
      where("status", "==", "pending")
    );
    const unsub = onSnapshot(q, (snap) => {
      setInvites(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [currentUser]);

  // Only fetch Firestore projects here
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "Projects"), (snap) => {
  setFirestoreProjects(snap.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() })));
    });
    return unsub;
  }, []);

  // Fetch requests from Firestore and setRequests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;
      const q = query(
        collection(db, "Invites"),
        where("toUserId", "==", currentUser.uid),
        where("status", "==", "pending")
      );
      const snap = await getDocs(q);
  setRequests(snap.docs.map(doc => ({ id: doc.id.toString(), ...doc.data() })));
    };
    fetchRequests();
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogleAndSaveProfile();
      alert(`Welcome, ${user.displayName}!`);
    } catch (e) {
      alert("Login failed.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const handleAccept = async (id: string) => {
    // Update Firestore to accept
    await updateDoc(doc(db, "Invites", id), { status: "accepted" });
    // Remove from requests list
  setRequests(reqs => reqs.filter(r => r.id !== id));
  };

  const handleReject = async (id: string) => {
    // Update Firestore to reject
    await updateDoc(doc(db, "Invites", id), { status: "denied" });
    // Remove from requests list
  setRequests(reqs => reqs.filter(r => r.id !== id));
  };

  // Only Firestore projects
  const allProjects = firestoreProjects;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <>
      <header className="home-header">
  <h1 className="thinktree-title">ThinkTree.</h1>
        <div className="header-actions">
          <button className="header-button create-button" onClick={() => navigate('/create')}>Create</button>
          <button onClick={() => setModalOpen(true)}>Notifications</button>
          <NotificationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            requests={requests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
          {!currentUser ? (
            <button className="header-button login-button" onClick={handleLogin}>Login</button>
          ) : (
            <div className="profile-dropdown-container" ref={profileRef} style={{ position: "relative" }}>
              <img
                src={currentUser?.photoURL || undefined}
                alt={currentUser.displayName || "Profile"}
                className="profile-icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: 0,
                  verticalAlign: "middle",
                  cursor: "pointer"
                }}
                onClick={() => setProfileDropdownOpen((open) => !open)}
              />
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="profile-dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="home-intro">
        <p className="home-description custom-desc">
          Explore ideas and connect with their creators. Click on a project to learn more.
        </p>
      </div>
      <div className="masonry-layout">
        {allProjects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id} state={{ project }}>
            <div className="widget">
              {project.image ? (
                <>
                  <img src={project.image} alt={project.name} className="widget-image" />
                  <div className="widget-overlay">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                </>
              ) : (
                <div className="widget-content">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {showInvitePopup && (
        <div className="invite-popup">
          <h4>Collaboration Requests</h4>
          {invites.length === 0 ? (
            <p>No requests</p>
          ) : (
            invites.map(invite => (
              <div key={invite.id} className="invite-item">
                <img src={invite.fromUser.photoURL} alt={invite.fromUser.displayName} style={{ width: 32, borderRadius: "50%" }} />
                <span>{invite.fromUser.displayName} wants to collaborate!</span>
                <button onClick={async () => {
                  // Accept: update Firestore
                  await updateDoc(doc(db, "Invites", invite.id), { status: "accepted" });
                }}>Accept</button>
                <button onClick={async () => {
                  // Deny: update Firestore
                  await updateDoc(doc(db, "Invites", invite.id), { status: "denied" });
                }}>Deny</button>
              </div>
            ))
          )}
          <button onClick={() => setShowInvitePopup(false)}>Close</button>
        </div>
      )}

    </>
  );
}

export default Home;