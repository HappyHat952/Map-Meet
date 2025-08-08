import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Project } from '../types';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const location = useLocation();
  const project = location.state?.project as Project | undefined;

  if (!project) {
    // If no project data is passed in state (e.g., direct URL access),
    // redirect to the home page as a fallback.
    return <Navigate to="/" replace />;
  }

  return (
    <div className="project-detail-container">
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
      <div className={`project-detail-card ${!project.image ? 'no-image' : ''}`}>
        {project.image && (
          <img
            src={project.image}
            alt={project.name}
            className="project-detail-image"
          />
        )}
        <div className="project-detail-content">
          <h1>{project.name}</h1>
          <div className="author-info-detail">
            <img
              src={project.authorAvatar}
              alt={project.author}
              className="author-avatar-detail"
            />
            <span className="author-name-detail">{project.author}</span>
          </div>
          <p className="project-description">{project.description}</p>
          <div className="project-detail-actions">
            <button className="action-button like-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.271 2.5 1.755 2.5 4.723c0 1.524.608 2.84 1.561 3.878A12.9 12.9 0 0 0 8 13.593a12.9 12.9 0 0 0 3.939-4.992c.953-1.038 1.56-2.354 1.56-3.878 0-2.968-3.1-4.452-4.783-2.708L8 2.748z"/>
              </svg>
              Like
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;