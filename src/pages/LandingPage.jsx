import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/landingpage.css';
import Navbar from '../components/Navbar';
import { useProfile } from '../context/ProfileContext';
import useYouTube from '../hooks/useYouTube';

import abdulBariImg from '../assets/images/abdul bari.png';
import tocImg from '../assets/images/toc.jpeg';
import mpmcImg from '../assets/images/mpmc1.jpeg';
import dsaImg from '../assets/images/dsa.png';
import MPMCImg from '../assets/images/MPMC.jpg';

export default function LandingPage() {
  const { profile, startWatching, markAsComplete } = useProfile();
  const { fetchSubjectPlaylists, loading } = useYouTube();
  const [index, setIndex] = useState(0);
  const slideCount = 3;

  const [modalSubject, setModalSubject] = useState(null);
  const [modalModules, setModalModules] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const mySubjects = [
    { key: 'DSA', title: 'Data Structure and Algorithm', query: 'Data Structure and Algorithms full course', img: dsaImg, meta: 'Master arrays, trees, graphs, sorting, searching, and dynamic programming for technical interviews.' },
    { key: 'MPMC', title: 'Microprocessors & Microcontrollers', query: 'Microprocessors 8086 microcontrollers tutorial', img: MPMCImg, meta: 'Master architecture, programming, and interfacing of 16-bit processors and ARM controllers.' },
    { key: 'TOC', title: 'Theory of Computation', query: 'Theory of Computation automota turing machines', img: tocImg, meta: 'Learn automata theory, formal languages, Turing machines and computational limits safely.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) >= slideCount ? 0 : prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const titleStrip = (name) => {
    if (!name) return "";
    return name.length > 35 ? name.substring(0, 35) + "..." : name;
  };

  const nextSlide = () => setIndex((prev) => (prev + 1) >= slideCount ? 0 : prev + 1);
  const prevSlide = () => setIndex((prev) => (prev - 1) < 0 ? slideCount - 1 : prev - 1);

  const calculateProgress = (subjectTitle) => {
    if (!profile?.videosWatched) return 0;
    const count = profile.videosWatched.filter(v => v.subject === subjectTitle).length;
    return Math.min(100, Math.round((count / 35) * 100)); // 35 total videos approx
  };

  const openNetflixModal = (sub) => {
    setModalSubject(sub);
    setSelectedSeason(1);
    setModalModules([]);
    fetchSubjectPlaylists(sub.key, sub.query, []).then(mods => setModalModules(mods || []));
  };

  const isWatched = (vidId) => profile?.videosWatched?.some(v => v.id === vidId);

  return (
    <div className="landing-body" style={{ overflow: modalSubject ? 'hidden' : 'auto' }}>
      <Navbar />

      {/* HERO SLIDER */}
      <section className="hero-slider" style={{ paddingTop: '145px' }}>
        <div className="slides" style={{ transform: `translateX(-${index * 100}%)` }}>
          <div className="slide">
             {/* Left Text */}
            <div className="hero-text">
              <p className="category">COMPUTER SCIENCE</p>
              <h1>Data Structures<br/>and Algorithms</h1>
              <p className="meta">Abdul Bari | 7 modules | 35 videos</p>
              <p className="description">Master fundamental concepts in data structures, sorting algorithms and computational complexity.</p>
              <div className="hero-buttons">
                <button className="primary-btn" onClick={() => openNetflixModal(mySubjects[0])}>Start Learning</button>
              </div>
            </div>
            <div className="hero-image"><img src={abdulBariImg} alt="DSA" /></div>
          </div>

          <div className="slide">
            <div className="hero-text">
              <p className="category">COMPUTER SCIENCE</p>
              <h1>Microprocessors<br/>& Microcontrollers</h1>
              <p className="meta">BITS Faculty | 7 modules | 35 videos</p>
              <p className="description">Master processor architecture, assembly programming and interfacing techniques.</p>
              <div className="hero-buttons">
                <button className="primary-btn" onClick={() => openNetflixModal(mySubjects[1])}>Start Learning</button>
              </div>
            </div>
            <div className="hero-image"><img src={mpmcImg} alt="MPMC" /></div>
          </div>

          <div className="slide">
            <div className="hero-text">
              <p className="category">COMPUTER SCIENCE</p>
              <h1>Theory of<br/>Computation</h1>
              <p className="meta">Jaison Joshy | 7 modules | 35 videos</p>
              <p className="description">Learn automata theory, formal languages, Turing machines and computational limits.</p>
              <div className="hero-buttons">
                <button className="primary-btn" onClick={() => openNetflixModal(mySubjects[2])}>Start Learning</button>
              </div>
            </div>
            <div className="hero-image"><img src={tocImg} alt="TOC" /></div>
          </div>
        </div>

        <button className="arrow left" onClick={prevSlide}>&#10094;</button>
        <button className="arrow right" onClick={nextSlide}>&#10095;</button>
      </section>

      {/* CONTINUE WATCHING */}
      <section className="section" style={{ marginTop: '20px' }}>
        <h2>Continue Watching</h2>
        {(!profile?.inProgressVideos || profile.inProgressVideos.length === 0) ? (
          <p style={{ opacity: 0.7 }}>Start watching a playlist module to see your history logged here!</p>
        ) : (
          <div className="horizontal-scroll" id="continueScroll">
            {profile.inProgressVideos.map((vid, idx) => (
              <div className="video-card" key={vid.id || idx}>
                <a href={`https://www.youtube.com/watch?v=${vid.id}`} target="_blank" rel="noopener noreferrer">
                  <img src={vid.thumb} alt={titleStrip(vid.title)} />
                </a>
                <h4 dangerouslySetInnerHTML={{ __html: titleStrip(vid.title) }}></h4>
                <div className="video-progress">
                  <div className="progress-fill" style={{ width: '15%' }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MY SUBJECTS */}
      <section className="section" style={{ marginBottom: '80px' }}>
        <h2>My Subjects</h2>
        <div>
          {mySubjects.map(sub => {
            const p = calculateProgress(sub.title);
            return (
              <div className="subject-card" key={sub.key} style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} onClick={() => openNetflixModal(sub)}>
                <img src={sub.img} alt={sub.key} />
                <div className="subject-content">
                  <div className="subject-header">
                    <h3>{sub.title}</h3>
                  </div>
                  <p>{sub.meta}</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${p}%` }}></div>
                  </div>
                  <small>{p}% Complete</small>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NETFLIX OVERLAY MODAL */}
      {modalSubject && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex',
          justifyContent: 'center', alignItems: 'center', padding: '40px'
        }} onClick={(e) => { if (e.target === e.currentTarget) setModalSubject(null) }}>
          
          <div style={{
            width: '100%', maxWidth: '900px', height: '85vh', backgroundColor: '#141414',
            borderRadius: '12px', overflowY: 'auto', position: 'relative', boxShadow: '0 0 30px rgba(0,0,0,0.8)'
          }}>
            {/* Header Hero */}
            <div style={{ 
              height: '300px', width: '100%', backgroundImage: `linear-gradient(to top, #141414 0%, rgba(20,20,20,0) 100%), url(${modalSubject.img})`,
              backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
            }}>
              <button 
                onClick={() => setModalSubject(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', fontSize: '24px', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}
              >✕</button>
              <div style={{ position: 'absolute', bottom: '20px', left: '40px' }}>
                <h1 style={{ fontSize: '3rem', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{modalSubject.title}</h1>
                <p style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '1.2rem', color: '#a3a3a3', fontWeight: 'bold' }}>
                  <span style={{ color: '#46d369' }}>98% Match</span> <span>2026</span> <span>7 Modules</span> <span>HD</span>
                </p>
                <p style={{ maxWidth: '600px', fontSize: '1rem', marginTop: '10px' }}>{modalSubject.meta}</p>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Episodes</h2>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  style={{ background: '#242424', color: 'white', padding: '10px 15px', fontSize: '1.1rem', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', outline: 'none' }}
                >
                  {[1,2,3,4,5,6,7].map(num => <option key={num} value={num}>Module {num}</option>)}
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>Fetching Episodes from YouTube API...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {modalModules[selectedSeason - 1] && modalModules[selectedSeason - 1].map((vid, idx) => (
                    <div key={vid.id || idx} style={{ 
                      display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', 
                      borderBottom: '1px solid #333', borderRadius: '8px', transition: 'background 0.2s', cursor: 'pointer' 
                    }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      
                      <span style={{ fontSize: '1.5rem', color: '#888', width: '30px', textAlign: 'center' }}>{idx + 1}</span>
                      
                      <a 
                        href={`https://www.youtube.com/watch?v=${vid.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ position: 'relative', width: '150px', height: '85px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}
                        onClick={() => startWatching({ id: vid.id, title: vid.title, thumb: vid.thumb, subject: modalSubject.title })}
                      >
                        <img src={vid.thumb} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                          <span style={{ border: '2px solid white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', background: 'rgba(0,0,0,0.5)' }}>▶</span>
                        </div>
                      </a>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }} dangerouslySetInnerHTML={{ __html: vid.title }}></h4>
                        <p style={{ fontSize: '0.85rem', color: '#a3a3a3', margin: 0, lineHeight: 1.4 }}>{vid.desc.length > 150 ? vid.desc.substring(0, 150) + '...' : vid.desc}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={isWatched(vid.id)} 
                          onChange={() => !isWatched(vid.id) && markAsComplete({ id: vid.id, title: vid.title, thumb: vid.thumb, subject: modalSubject.title })}
                          style={{ width: '25px', height: '25px', cursor: 'pointer', accentColor: '#e50914' }}
                          title="Mark as completed"
                        />
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>{vid.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
