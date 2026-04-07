import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/playlists.css';
import Navbar from '../components/Navbar';
import { useProfile } from '../context/ProfileContext';
import useYouTube from '../hooks/useYouTube';

// Import fallback images
import thumb1 from '../assets/images/thumb1.jpg';
import thumb2 from '../assets/images/thumb2.jpg';
import thumb3 from '../assets/images/thumb3.jpg';
import thumb4 from '../assets/images/thumb4.jpg';
import db1 from '../assets/images/db1.jpg';

const fallbackDSA = [
  { id: 'd1', thumb: thumb1, title: 'Arrays in Data Structures', desc: 'An array is a data structure that stores multiple values of the same type in contiguous memory locations.', duration: '23m' },
  { id: 'd2', thumb: thumb2, title: 'Arrays Operations', desc: 'Array operations are actions performed on arrays like insertion, deletion, traversal...', duration: '30m' },
  { id: 'd3', thumb: thumb3, title: 'Pointers & Arrays', desc: 'Pointers store the address of a variable and arrays store multiple values...', duration: '25m' },
  { id: 'd4', thumb: thumb4, title: '2D Arrays', desc: 'A 2D array is an array of arrays used to store data in rows and columns.', duration: '38m' },
  { id: 'd5', thumb: db1, title: 'Linked Lists', desc: 'Introduction to linked lists and their basic operations.', duration: '40m' }
];

function PlaylistSection({ subjectKey, title, query, fallbackData }) {
  const [selectedModule, setSelectedModule] = useState("All");
  const [modulesData, setModulesData] = useState([]);

  const { startWatching, markAsComplete, profile } = useProfile();
  const { fetchSubjectPlaylists, loading } = useYouTube();

  const isWatched = (vidId) => profile?.videosWatched?.some(v => v.id === vidId);

  useEffect(() => {
    fetchSubjectPlaylists(subjectKey, query, fallbackData).then(mods => {
      if (mods) setModulesData(mods)
    });
  }, [subjectKey, query]);

  let videosToRender = [];
  if (modulesData.length > 0) {
    if (selectedModule === "All") {
      videosToRender = modulesData.flat();
    } else {
      const modIndex = parseInt(selectedModule.replace("Module ", "")) - 1;
      videosToRender = modulesData[modIndex] || [];
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '70px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          style={{ padding: '8px 12px', background: '#222', color: '#fff', border: '1px solid #e50914', borderRadius: '6px', cursor: 'pointer', outline: 'none' }}
        >
          <option value="All">All Modules</option>
          {[1, 2, 3, 4, 5, 6, 7].map(num => <option key={num} value={`Module ${num}`}>Module {num}</option>)}
        </select>
      </div>

      {loading && modulesData.length === 0 ? (
        <p style={{ color: '#ccc' }}>Loading videos from YouTube...</p>
      ) : (
        <div className="playlist">
          {videosToRender.map((vid, idx) => (
            <div className="item" key={vid.id || idx}>
              <span className="num">{idx + 1}</span>
              <a
                href={`https://www.youtube.com/watch?v=${vid.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => startWatching({ id: vid.id, title: vid.title, thumb: vid.thumb, subject: title })}
              >
                <img src={vid.thumb} alt={vid.title} />
              </a>
              <div className="text" style={{ flex: 1 }}>
                <h3 dangerouslySetInnerHTML={{ __html: vid.title }}></h3>
                <p>{vid.desc.length > 50 ? vid.desc.substring(0, 50) + "...." : vid.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingRight: '15px' }}>
                <span className="time">{vid.duration}</span>
                <input
                  type="checkbox"
                  checked={isWatched(vid.id)}
                  onChange={() => !isWatched(vid.id) && markAsComplete({ id: vid.id, title: vid.title, thumb: vid.thumb, subject: title })}
                  style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#e50914' }}
                  title="Mark as completed"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function Playlists() {
  const [activeSubject, setActiveSubject] = useState("All");

  const subjects = [
    {
      key: "DSA",
      title: "Data Structure and Algorithm",
      query: "Stacks, Queues, Linked List, Trees, Graphs, Heaps, Hashing, Searching, Sorting",
      fallback: fallbackDSA
    },
    {
      key: "MPMC",
      title: "Microprocessors & Microcontrollers",
      query: "8086 Microprocessor, 8051 Microcontroller, Assembly Language Programming, Memory Interfacing, Interrupts, DMA, Peripherals",
      fallback: fallbackDSA
    },
    {
      key: "TOC",
      title: "Theory of Computation",
      query: "Regular Languages, Context-Free Grammars, Pushdown Automata, Turing Machines",
      fallback: fallbackDSA
    }
  ];

  return (
    <div className="playlists-body">
      <Navbar />

      <div className="container" style={{ paddingBottom: '60px' }}>
        <div className="info" style={{ marginBottom: '20px' }}>
          <p className="desc" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Explore core academic subjects. Filter by 7 distinct modules per subject to focus your study flow natively. Check videos off sequentially!
          </p>
        </div>

        {/* Mini Navbar */}
        <div className="mini-navbar">
          {["All", "DSA", "MPMC", "TOC"].map(sub => (
            <button
              key={sub}
              className={`mini-nav-item ${activeSubject === sub ? 'active' : ''}`}
              onClick={() => setActiveSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>

        {subjects.map(sub => {
          if (activeSubject !== "All" && activeSubject !== sub.key) return null;
          return (
            <PlaylistSection
              key={sub.key}
              subjectKey={sub.key}
              title={sub.title}
              query={sub.query}
              fallbackData={sub.fallback}
            />
          );
        })}
      </div>
    </div>
  );
}
