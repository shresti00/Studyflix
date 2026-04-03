import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/profile.css';
import sfIcon from '../assets/images/sf.png';
import caoImg from '../assets/images/cao.png';
import micrprcImg from '../assets/images/micrprc.png';
import mlImg from '../assets/images/ml.png';
import Navbar from '../components/Navbar';
import { useProfile } from '../context/ProfileContext';

export default function Profile() {
  const { profile, updateProfile, logActivity } = useProfile();

  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectData, setSubjectData] = useState(null);
  
  const [editForm, setEditForm] = useState({ name: '', email: '', branch: '' });
  const picInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const val = event.target.result;
        updateProfile({ profilePicture: val });
        showToast('✓ Profile picture updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = () => {
    setEditForm({ name: profile.name, email: profile.email, branch: profile.branch });
    setEditModalOpen(true);
  };

  const saveProfile = (e) => {
    updateProfile(editForm);
    setEditModalOpen(false);
    showToast('✓ Profile updated successfully!', 'success');
  };

  const openSubjectModal = (subjectKey, subjectName) => {
    const stats = calculateProgress(subjectName);
    setSubjectData({ 
      key: subjectKey, 
      progress: stats.p, 
      videosWatched: stats.count, 
      videosWatchedList: stats.vids 
    });
    setSubjectModalOpen(true);
  };

  const calculateProgress = (subjectTitle) => {
    if (!profile?.videosWatched) return { p: 0, count: 0, vids: [] };
    const filtered = profile.videosWatched.filter(v => v.subject === subjectTitle);
    const count = filtered.length;
    // Assume 35 typical module videos per subject total (7 modules * 5 vids)
    const p = Math.min(100, Math.round((count / 35) * 100));
    return { p, count, vids: filtered.map(v => v.title) };
  };

  const recentWatched = profile?.videosWatched ? profile.videosWatched.slice(-3).reverse() : [];

  const [heatmapBlocks, setHeatmapBlocks] = useState(5);

  useEffect(() => {
    function updateBlocks() {
      const panel = document.querySelector('.glass-panel');
      if (panel) {
        const available = panel.clientWidth - 60;
        let maxBlocks = Math.floor((available + 40) / 132);
        if (maxBlocks < 1) maxBlocks = 1;
        setHeatmapBlocks(maxBlocks);
      }
    }
    updateBlocks();
    window.addEventListener('resize', updateBlocks);
    return () => window.removeEventListener('resize', updateBlocks);
  }, []);

  // We use profile.activityLog which safely captures both logins and videos watched
  const heatmapMap = profile.activityLog || {};

  return (
    <div className="profile-body">
      <Navbar />

      <div className="content-wrapper">
        <aside className="sidebar">
          <div className="profile-pic-main" id="profilePicContainer">
            {profile.profilePicture ? (
              <img id="customProfilePic" src={profile.profilePicture} alt="Profile" style={{display: 'block'}} />
            ) : (
              <svg viewBox="0 0 24 24" className="user-svg-red" id="defaultProfilePic">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
            <button className="change-pic-btn" id="changePicBtn" title="Change profile picture" onClick={() => picInputRef.current.click()}>📷</button>
            <input type="file" id="picInput" accept="image/*" style={{display: 'none'}} ref={picInputRef} onChange={handlePicChange} />
          </div>
          <div className="profile-info">
            <p className="profile-name" id="profileName">{profile.name}</p>
            <p><span>Date joined:</span> <span id="dateJoined">{profile.dateJoined}</span></p>
            <p><span>Branch:</span> <span id="profileBranch">{profile.branch}</span></p>
            <p><span>Email:</span> <span id="profileEmail">{profile.email}</span></p>
          </div>
          <button className="edit-btn" id="editProfileBtn" onClick={openEditModal}>Edit Profile</button>
        </aside>

        <main className="dashboard-area">
          <section className="stats-container">
            <div className="streak-box">
              <h3 className="section-label">Streak</h3>
              <div className="streak-ring">
                <div className="streak-text" id="streakText">{profile.streak} day{profile.streak !== 1 ? 's' : ''} 🔥</div>
              </div>
            </div>
            <div className="subject-bars">
              {[ { key: 'DSA', name: 'Data Structure and Algorithm' }, 
                 { key: 'MPMC', name: 'Microprocessors & Microcontrollers' }, 
                 { key: 'TOC', name: 'Theory of Computation' } 
               ].map(sub => {
                 const stats = calculateProgress(sub.name);
                 return (
                  <div key={sub.key} className="sub-item" onClick={() => openSubjectModal(sub.key, sub.name)}>
                    <span>{sub.key}</span>
                    <div className="bar"><div className="fill" style={{width: `${stats.p}%`}}></div></div>
                  </div>
                 );
              })}
            </div>
          </section>

          <section className="heatmap-section">
            <h3 className="section-label">Active Days</h3>
            <div className="glass-panel" style={{ position: 'relative', paddingTop: '40px' }}>
              <div style={{ position: 'absolute', top: '15px', left: '30px', display: 'flex', gap: '96px', color: '#888', fontSize: '12px', fontWeight: 'bold' }}>
                {Array.from({ length: heatmapBlocks }).map((_, blockIdx) => {
                  const dayOffset = (heatmapBlocks - 1 - blockIdx) * 30 + 15;
                  const d = new Date();
                  d.setDate(d.getDate() - dayOffset);
                  return <span key={blockIdx} style={{ width: '36px' }}>{d.toLocaleString('default', { month: 'short' })}</span>;
                })}
              </div>
              <div className="heatmap-wrapper" id="heatmap-container">
                 {Array.from({ length: heatmapBlocks }).map((_, blockIdx) => (
                    <div key={blockIdx} className="month-block">
                      {Array.from({ length: 30 }).map((_, dayIdx) => {
                        const i = (heatmapBlocks - 1 - blockIdx) * 30 + (29 - dayIdx);
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        const count = heatmapMap[date.toDateString()] || 0;
                        
                        let activeClass = '';
                        if (count === 1) activeClass = 'active-1';
                        else if (count === 2) activeClass = 'active-2';
                        else if (count > 2) activeClass = 'active-3';
                        
                        return (
                          <div 
                            key={dayIdx} 
                            className={`day-box ${activeClass}`}
                            title={`${count} video${count !== 1 ? 's' : ''} on ${date.toDateString()}`}
                          />
                        );
                      })}
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {recentWatched.length > 0 && (
            <section className="video-section">
              <h3 className="section-label">Recently Watched</h3>
              <div className="video-row">
                {recentWatched.map((vid, idx) => (
                  <div className="vid-wrap" key={idx}>
                    <a href={`https://www.youtube.com/watch?v=${vid.id}`} target="_blank" rel="noopener noreferrer">
                      <div className="vid-card" style={{backgroundImage: `url(${vid.thumb})`}}></div>
                    </a>
                    <span className="vid-title" dangerouslySetInnerHTML={{ __html: vid.title }}></span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      <div id="editModal" className={`modal ${editModalOpen ? 'show' : ''}`} onClick={(e) => { if(e.target.className.includes('modal show')) setEditModalOpen(false)}}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Profile</h2>
            <button className="close-btn" onClick={() => setEditModalOpen(false)}>&times;</button>
          </div>
          <form id="editProfileForm" onSubmit={saveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <select value={editForm.branch} onChange={e => setEditForm({...editForm, branch: e.target.value})}>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Electrical</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Subject Details Modal */}
      <div id="subjectModal" className={`modal ${subjectModalOpen ? 'show' : ''}`} onClick={(e) => { if (e.target.className.includes('modal show')) setSubjectModalOpen(false)}}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 id="subjectTitle">{subjectData ? `${subjectData.key} - Details` : ''}</h2>
            <button className="close-btn" onClick={() => setSubjectModalOpen(false)}>&times;</button>
          </div>
          <div id="subjectDetails">
            {subjectData && (
              <>
                <p><strong>Progress:</strong> {subjectData.progress}%</p>
                <p><strong>Videos Watched:</strong> {subjectData.videosWatched} / 35</p>
                <hr />
                <p><strong>Completed Checkpoints:</strong></p>
                {subjectData.videosWatchedList.length > 0 ? (
                  <ul>
                    {subjectData.videosWatchedList.map((vid, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: vid }}></li>)}
                  </ul>
                ) : (
                  <p style={{ opacity: 0.7 }}>No videos checked off yet for this subject. Try watching some modules!</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div id="toast" className={`toast ${toast.type}`} style={{ display: toast.visible ? 'block' : 'none' }}>
        {toast.message}
      </div>
    </div>
  );
}
