import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import Playlists from './pages/Playlists';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import Todo from './pages/Todo';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/todo" element={<Todo />} />
        </Routes>
      </Router>
    </ProfileProvider>
  );
}

export default App;
