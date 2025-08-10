import React, { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Project } from '../types';
import './ProjectDetail.css';
import { auth, sendInviteRequest, addCommentToProject, getProjectLikes, likeProject, unlikeProject } from '../firebase';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

const ProjectDetail = () => {
  const location = useLocation();
  const project = location.state?.project as Project | undefined;
  // Change comments to store user info
  const [comments, setComments] = useState<{ text: string, author: string, photoURL: string, timestamp?: number }[]>([]);
  // Fetch comments from Firestore for this project
  React.useEffect(() => {
    if (!project) return;
    const fetchComments = async () => {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'Comments'),
          where('projectId', '==', project.id),
          orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedComments = querySnapshot.docs.map(doc => ({
          ...doc.data(),
        })) as { text: string, author: string, photoURL: string, timestamp?: number }[];
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [project]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  // Fetch likes on mount
  React.useEffect(() => {
    if (!project) return;
    const fetchLikes = async () => {
      const likeCount = await getProjectLikes(project.id);
      setLikes(likeCount);
    };
    fetchLikes();
  }, [project]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  if (!project) {
    // If no project data is passed in state
    // redirect to the home page as a fallback.
    return <Navigate to="/" replace />;
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser && project) {
      const commentObj = {
        text: newComment.trim(),
        author: currentUser.displayName || "User",
        photoURL: currentUser.photoURL || "https://i.pravatar.cc/150?img=21",
        timestamp: Date.now(),
      };
      try {
        await addCommentToProject(project.id, commentObj);
        setComments([commentObj, ...comments]); // Optimistic update
        setNewComment('');
      } catch (err) {
        alert('Failed to post comment.');
      }
    }
  };

  const handleInvite = async () => {
    if (!currentUser || !project) return;
    // Assume project.ownerId is the user id to send invite to
    await sendInviteRequest(project.id, project.ownerId, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    });
    alert("Invite request sent!");
  };

  return (
    <div className="project-detail">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
      
      <div className="project-content">
        <div className="left-section">
          {project.image && (
            <div className="image-section">
              <div className="image-container">
                <img
                  src={project.image}
                  alt={project.name}
                  className="project-detail-image"
                />
              </div>
              <div className="image-actions">
                <button
                  className={`modern-like-button${liked ? ' liked' : ''}`}
                  onClick={async () => {
                    if (!currentUser) return;
                    if (!liked) {
                      await likeProject(project.id, currentUser.uid);
                      setLikes(likes + 1);
                      setLiked(true);
                    } else {
                      await unlikeProject(project.id, currentUser.uid);
                      setLikes(Math.max(0, likes - 1));
                      setLiked(false);
                    }
                  }}
                  aria-label={liked ? "Unlike" : "Like"}
                  type="button"
                >
                  <span className="like-icon">
                    {liked ? (
                      // Filled heart
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#e0245e" viewBox="0 0 24 24">
                        <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 7.1 9.91c0 1.54 1.23 3.04 3.55 5.36l1.35 1.32 1.35-1.32c2.32-2.32 3.55-3.82 3.55-5.36 0-2.67-3.04-3.31-4.9-1.27z"/>
                      </svg>
                    ) : (
                      // Outline heart
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" stroke="#e0245e" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 7.1 9.91c0 1.54 1.23 3.04 3.55 5.36l1.35 1.32 1.35-1.32c2.32-2.32 3.55-3.82 3.55-5.36 0-2.67-3.04-3.31-4.9-1.27z"/>
                      </svg>
                    )}
                  </span>
                  <span className="like-badge">{likes}</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="project-info">
            <h1>{project.name}</h1>
            <p className="project-description">{project.description}</p>
            
            <div className="project-detail-actions">
              <button className="action-button invite-button" onClick={handleInvite}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                </svg>
                Request Invite
              </button>
              <button className="action-button view-mindmap-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                </svg>
                View Mindmap
              </button>
            </div>
            
            <div className="author-info-detail">
              <img
                src={project.authorAvatar}
                alt={project.author}
                className="author-avatar-detail"
              />
              <span className="author-name-detail">{project.author}</span>
            </div>
          </div>

          <div className="compact-comments-section">
            <h4>Comments</h4>
            <form onSubmit={handleCommentSubmit} className="compact-comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? "Add a comment..." : "Login to comment"}
                className="compact-comment-input"
                disabled={!currentUser}
              />
              <button type="submit" className="compact-submit-button" disabled={!currentUser}>
                Post
              </button>
            </form>
            <div className="compact-comments-list">
              {comments.length === 0 ? (
                <p className="compact-no-comments">No comments yet</p>
              ) : (
                comments.slice(0, 3).map((comment, index) => (
                  <div key={index} className="compact-comment-item">
                    <img src={comment.photoURL} alt={comment.author} className="compact-comment-avatar" />
                    <div className="compact-comment-content">
                      <span className="compact-comment-author">{comment.author}</span>
                      <p className="compact-comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
              {comments.length > 3 && (
                <p className="view-more-comments">View {comments.length - 3} more comments...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;