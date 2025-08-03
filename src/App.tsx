import { useState } from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Profile from './pages/Profile';
import Project from './pages/Project';
import PageNotFound from './pages/PageNotFound';

function App() {

  return (
    <>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element = {<Map/>} />
        <Route path="/profile" element = {<Profile/>} />
        <Route path="/project" element = {<Project/>} />
        <Route path="*" element = {<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
