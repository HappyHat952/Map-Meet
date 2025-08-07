import { useState } from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import PageNotFound from './pages/PageNotFound';

function App() {

  return (
    <>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element = {<Map/>} />
        <Route path="/profile" element = {<Profile/>} />
        <Route path="/project/:id" element = {<ProjectDetail/>} />
        <Route path="*" element = {<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
