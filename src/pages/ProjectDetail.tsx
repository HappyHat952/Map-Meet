import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { Project } from '../types';
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
      <div className="project-detail-card">
        <img
          src={project.image}
          alt={project.name}
          className="project-detail-image"
        />
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;