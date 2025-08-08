import React, { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Project } from '../types';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const location = useLocation();
  const project = location.state?.project as Project | undefined;
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  if (!project) {
    // If no project data is passed in state (e.g., direct URL access),
    // redirect to the home page as a fallback.
    return <Navigate to="/" replace />;
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment('');
    }
  };

  return (
    <div className="project-detail-container">
      <div className="fullscreen-layout">
        <div className="left-panel">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          
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
                <button className="image-action-button like-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.271 2.5 1.755 2.5 4.723c0 1.524.608 2.84 1.561 3.878A12.9 12.9 0 0 0 8 13.593a12.9 12.9 0 0 0 3.939-4.992c.953-1.038 1.56-2.354 1.56-3.878 0-2.968-3.1-4.452-4.783-2.708L8 2.748z"/>
                  </svg>
                </button>
                <button 
                  className="image-action-button comment-button"
                  onClick={() => setShowComments(!showComments)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="project-info">
            <h1>{project.name}</h1>
            <p className="project-description">{project.description}</p>
            
            <div className="project-detail-actions">
              <button className="action-button invite-button">
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
        </div>
        
        <div className="right-panel">
          <div className="comments-section">
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
                rows={3}
              />
              <button type="submit" className="submit-comment-button">
                Post Comment
              </button>
            </form>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-avatar">
                      <img src="https://i.pravatar.cc/150?img=21" alt="Commenter" />
                    </div>
                    <div className="comment-content">
                      <span className="comment-author">Anonymous User</span>
                      <p className="comment-text">{comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;