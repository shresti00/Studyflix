import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/notes.css';
import Navbar from '../components/Navbar';
import sfIcon from '../assets/images/sf.png';

const STORAGE_KEY_NOTES = 'studyflix-notes';

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [newSubject, setNewSubject] = useState('');
  const [newModule, setNewModule] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY_NOTES);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (e) {
        setNotes([]);
      }
    }
  }, []);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    sessionStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(newNotes));
  };

  const generateId = () => 'note-' + Math.random().toString(16).slice(2) + Date.now();

  const addNote = () => {
    const subject = newSubject.trim();
    const module = newModule.trim();
    if (!subject || !module) return;

    const newNoteList = [{
      id: generateId(),
      subject,
      module,
      content: '',
      pinned: true,
      createdAt: Date.now()
    }, ...notes];

    saveNotes(newNoteList);
    setNewSubject('');
    setNewModule('');
  };

  const deleteNote = (e, id) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    saveNotes(newNotes);
  };

  const togglePin = (e, id) => {
    e.stopPropagation();
    const newNotes = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    saveNotes(newNotes);
  };

  const openEditModal = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      setCurrentEditId(id);
      setEditContent(note.content);
      setModalOpen(true);
    }
  };

  const saveEdit = () => {
    const newNotes = notes.map(n => n.id === currentEditId ? { ...n, content: editContent } : n);
    saveNotes(newNotes);
    setModalOpen(false);
  };

  const subjects = ['all', ...new Set(notes.map(n => n.subject))].sort();
  const filteredNotes = notes.filter(n => subjectFilter === 'all' || n.subject === subjectFilter);
  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className="notes-body">
      <Navbar />

      {/* MAIN */}
      <main className="main">
        {/* Top controls row */}
        <div className="toolbar">
          <button id="todo-page-btn" onClick={() => navigate('/todo')}>Open To‑Do List</button>

          <div className="add-note">
            <input 
              type="text" 
              placeholder="Subject name" 
              value={newSubject} 
              onChange={e => setNewSubject(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && addNote()} 
            />
            <input 
              type="text" 
              placeholder="Module name" 
              value={newModule} 
              onChange={e => setNewModule(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && addNote()} 
            />
            <button id="add-note-btn" onClick={addNote}>Add note</button>
          </div>

          <div className="subject-filter">
            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
              {subjects.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All subjects' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes section */}
        <div className="notes-rows">
          <section className="notes-section">
            <div className="section-title">Pinned</div>
            <div className="notes-grid" id="pinned-notes">
              {pinnedNotes.length === 0 ? <div className="empty-state">No notes here</div> : pinnedNotes.map(note => (
                <article key={note.id} className="note-card">
                  <div className="card-header">
                    <div className="card-subject-title">{note.subject}</div>
                    <div className="card-subject-sub">{note.module}</div>
                    <div className="card-actions">
                      <button className="card-action-btn" onClick={e => togglePin(e, note.id)}>Unpin</button>
                      <button className="card-action-btn delete" onClick={e => deleteNote(e, note.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="card-divider"></div>
                  <div className="card-content" onClick={() => openEditModal(note.id)}>
                    {note.content}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="notes-section">
            <div className="section-title">Other Notes</div>
            <div className="notes-grid" id="other-notes">
              {otherNotes.length === 0 ? <div className="empty-state">No notes here</div> : otherNotes.map(note => (
                <article key={note.id} className="note-card">
                  <div className="card-header">
                    <div className="card-subject-title">{note.subject}</div>
                    <div className="card-subject-sub">{note.module}</div>
                    <div className="card-actions">
                      <button className="card-action-btn" onClick={e => togglePin(e, note.id)}>Pin</button>
                      <button className="card-action-btn delete" onClick={e => deleteNote(e, note.id)}>Delete</button>
                    </div>
                  </div>
                  <div className="card-divider"></div>
                  <div className="card-content" onClick={() => openEditModal(note.id)}>
                    {note.content}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modal for editing notes */}
      <div id="note-modal" className="modal" style={{ display: modalOpen ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
          <h2>Edit Note</h2>
          <textarea rows="10" cols="50" value={editContent} onChange={e => setEditContent(e.target.value)}></textarea>
          <button id="save-note" onClick={saveEdit}>Save</button>
          <button id="cancel-note" onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
