import React, { useState, useEffect } from 'react';
import './Home.css';

// Define the type for a project
interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  author: string;
  authorAvatar: string;
}

// Helper to get random image with varying height
const getRandomImage = (id: number, width: number, height: number) => `https://picsum.photos/seed/${id}/${width}/${height}`;

// Mock data generation
const generateMockProjects = (count: number): Project[] => {
  const projects: Project[] = [];
  const authors = [
    { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Emily Jones', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];
  const projectNames = ['WeFit', 'Artify', 'CodeConnect', 'EcoTrack', 'FoodieFinds', 'TravelBuddy', 'MusicVerse', 'HealthHub', 'LearnLink', 'PetPal', 'HomeDecor', 'AutoFix', 'GameOn', 'StyleSwap', 'BookNook'];
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
      'A cozy corner of the internet for book lovers to discuss their favorite reads.'
  ];

  for (let i = 1; i <= count; i++) {
    const randomHeight = Math.floor(Math.random() * (500 - 200 + 1)) + 200; // Random height between 200 and 500
    const author = authors[i % authors.length];
    projects.push({
      id: i,
      name: projectNames[(i - 1) % projectNames.length],
      description: descriptions[(i - 1) % descriptions.length],
      image: getRandomImage(i, 400, randomHeight),
      author: author.name,
      authorAvatar: author.avatar,
    });
  }
  return projects;
};

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(generateMockProjects(15));
  }, []);

  return (
    <div className="masonry-layout">
      {projects.map((project) => (
        <div key={project.id} className="widget">
          <img src={project.image} alt={project.name} className="widget-image" />
          <div className="widget-content">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="author-info">
              <img src={project.authorAvatar} alt={project.author} className="author-avatar" />
              <span className="author-name">{project.author}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;