import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import type { Project } from '../types';
import './Home.css';
import { signInWithGoogleAndSaveProfile, auth, db } from '../firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import NotificationModal from './NotificationModal';



// Mock data generation
const generateMockProjects = (count: number): Project[] => {
  const projects: Project[] = [];
  const imageUrls = [
    'https://images.unsplash.com/photo-1494253109108-2e30c049369b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1485550409059-9afb054cada4?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1670590785994-ab5e8a2ccd61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHJhbmRvbXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1613336026275-d6d473084e85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHJhbmRvbXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHJhbmRvbXxlbnwwfHwwfHx8MA%3D%3D'
  ];
  const authors = [
    { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Emily Jones', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Michael Wang', avatar: 'https://i.pravatar.cc/150?img=6' },
    { name: 'Jessica Brown', avatar: 'https://i.pravatar.cc/150?img=7' },
    { name: 'Chris Wilson', avatar: 'https://i.pravatar.cc/150?img=8' },
    { name: 'Amanda Miller', avatar: 'https://i.pravatar.cc/150?img=9' },
    { name: 'James Davis', avatar: 'https://i.pravatar.cc/150?img=10' },
    { name: 'Linda Rodriguez', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Robert Martinez', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Patricia Hernandez', avatar: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Jennifer Lopez', avatar: 'https://i.pravatar.cc/150?img=14' },
    { name: 'William Gonzalez', avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Richard Perez', avatar: 'https://i.pravatar.cc/150?img=16' },
    { name: 'Susan Sanchez', avatar: 'https://i.pravatar.cc/150?img=17' },
    { name: 'Joseph Ramirez', avatar: 'https://i.pravatar.cc/150?img=18' },
    { name: 'Karen Torres', avatar: 'https://i.pravatar.cc/150?img=19' },
    { name: 'Thomas Flores', avatar: 'https://i.pravatar.cc/150?img=20' },
  ];
  const projectNames = [
    'WeFit', 'Artify', 'CodeConnect', 'EcoTrack', 'FoodieFinds',
    'TravelBuddy', 'MusicVerse', 'HealthHub', 'LearnLink', 'PetPal',
    'HomeDecor', 'AutoFix', 'GameOn', 'StyleSwap', 'BookNook',
    'CityQuest', 'MindWell', 'SpaceExplorer', 'RecipeGenius', 'GigFinder'
  ];
  const descriptions = [
    'A fitness app that helps users track their workouts and nutrition.',
    'An AI-powered platform for creating and sharing digital art.',
    'A social network for developers to collaborate on projects.',
    'An app for tracking your carbon footprint and promoting sustainable habits.',
    'Discover and share hidden gem restaurants and recipes.',
    'Connect with fellow travelers and plan your next adventure.',
    'A universe of music to explore, create playlists, and discover new artists.',
    'Your personal health assistant for monitoring symptoms and finding care.',
    'An online learning platform with courses from top instructors.',
    'Everything you need for your furry friends, from food to fun.',
    'Inspiration and tools for your next home renovation project.',
    'Connect with trusted mechanics for your car maintenance needs.',
    'A community for gamers to find teammates and compete.',
    'A marketplace for trading and selling pre-loved fashion.',
    'A cozy corner of the internet for book lovers to discuss their favorite reads.',
    'Explore your city and uncover hidden gems with interactive challenges.',
    'A mental wellness app providing meditation and mindfulness exercises.',
    'Journey through the cosmos with this educational space exploration app.',
    'Generate unique recipes based on the ingredients you have at home.',
    'A platform for freelancers to find and manage their next gig.'
  ];

  const descriptionOnlyWidgets = [4, 9, 14]; // IDs of widgets that will only show description

  for (let i = 1; i <= count; i++) {
    const author = authors[i % authors.length];
    const projectName = projectNames[(i - 1) % projectNames.length];
    const hasImage = !descriptionOnlyWidgets.includes(i);
    const imageUrl = imageUrls[(i - 1) % imageUrls.length];

    projects.push({
      id: i,
      name: projectName,
      description: descriptions[(i - 1) % descriptions.length],
      image: hasImage ? imageUrl : '',
      author: author.name,
      authorAvatar: author.avatar,
    });
  }
  return projects;
};

function Home() {
  const [mockProjects] = useState<Project[]>(generateMockProjects(20));
  const [firestoreProjects, setFirestoreProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<any[]>([]);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]); // Fetch from Firestore
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
      setFirestoreProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

  // Combine mock and Firestore projects
  const allProjects = [...firestoreProjects, ...mockProjects];

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
        <h1>Think Tree</h1>
        <div className="header-actions">
          <button className="header-button create-button" onClick={() => navigate('/create')}>Create</button>
          <button onClick={() => setModalOpen(true)}>🔔 Notifications</button>
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
                src={currentUser.photoURL}
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
        {currentUser && (
          <div className="welcome-message" style={{ marginBottom: 16 }}>
            Welcome, {currentUser.displayName}!
          </div>
        )}
        <p>Explore innovative projects and connect with their creators.</p>
        <p>Click on a project to learn more.</p>
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