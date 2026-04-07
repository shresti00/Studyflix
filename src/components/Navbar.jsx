import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import sfIcon from '../assets/images/sf.png';
import '../css/navbar.css';

export default function Navbar() {
  const { profile } = useProfile();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={sfIcon} alt="SF Logo" className="logo-img" />
        <span>StudyFlix</span>
      </div>
      
      <ul className="nav-links">
        <li className={path === '/' ? 'active' : ''}><Link to="/">Home</Link></li>
        <li className={path === '/playlists' ? 'active' : ''}><Link to="/playlists">Playlists</Link></li>
        <li className={path === '/notes' || path === '/todo' ? 'active' : ''}><Link to="/notes">Notes</Link></li>
      </ul>
      
      <div className="profile">
        <span className="streak">🔥 {profile?.streak || 0}</span>
        <Link to="/profile">
          {profile?.profilePicture ? (
            <img 
              src={profile.profilePicture} 
              alt="Profile" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e50914' }} 
            />
          ) : (
            <span className={`profile-icon ${path === '/profile' ? 'active' : ''}`}>👤</span>
          )}
        </Link>
      </div>
    </nav>
  );
}
