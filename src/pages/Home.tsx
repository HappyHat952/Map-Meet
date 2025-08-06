import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import './Home.css';

// Helper to get random image with varying height
// Using the /id/{id} endpoint for more reliable image loading
const getRandomImage = (id: number, width: number, height: number) => `https://picsum.photos/id/${id}/${width}/${height}`;

// Mock data generation
const generateMockProjects = (count: number): Project[] => {
  const projects: Project[] = [];
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

  for (let i = 1; i <= count; i++) {
    const randomHeight = Math.floor(Math.random() * (700 - 200 + 1)) + 200; // Random height between 200 and 700
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
    setProjects(generateMockProjects(20));
  }, []);

  return (
    <div className="masonry-layout">
      {projects.map((project) => (
        <Link to={`/project/${project.id}`} key={project.id} state={{ project }}>
          <div className="widget">
            <img src={project.image} alt={project.name} className="widget-image" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Home;