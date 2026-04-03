import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/todo.css';
import Navbar from '../components/Navbar';
import sfIcon from '../assets/images/sf.png';

const TODO_STORAGE_KEY = 'studyflix-todos';

export default function Todo() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState('');
  const [newDue, setNewDue] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(TODO_STORAGE_KEY);
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (e) {
        setTodos([]);
      }
    }
  }, []);

  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    sessionStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(newTodos));
  };

  const generateId = () => 'todo-' + Math.random().toString(16).slice(2) + Date.now();

  const addTodo = () => {
    const text = newText.trim();
    if (!text) return;

    const newTodos = [{
      id: generateId(),
      text,
      due: newDue,
      done: false,
      createdAt: Date.now()
    }, ...todos];

    saveTodos(newTodos);
    setNewText('');
    setNewDue('');
  };

  const toggleDone = (id, checked) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, done: checked } : t);
    saveTodos(newTodos);
  };

  const updateText = (id, text) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, text: text.trim() } : t);
    saveTodos(newTodos);
  };

  const updateDue = (id, due) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, due } : t);
    saveTodos(newTodos);
  };

  const deleteTodo = (id) => {
    const newTodos = todos.filter(t => t.id !== id);
    saveTodos(newTodos);
  };

  return (
    <div className="todo-body">
      <Navbar />

      <main className="main">
        <div className="toolbar">
          <button id="back-notes-btn" onClick={() => navigate('/notes')}>Back to Notes</button>

          <div className="add-todo">
            <input 
              type="text" 
              placeholder="To-do description" 
              value={newText} 
              onChange={e => setNewText(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && addTodo()}
            />
            <input 
              type="date" 
              value={newDue} 
              onChange={e => setNewDue(e.target.value)} 
            />
            <button id="add-todo-btn" onClick={addTodo}>Add To‑Do</button>
          </div>
        </div>

        <div className="todo-list" id="todo-list">
          {todos.length === 0 ? (
             <div className="empty-state">No to-dos yet. Add one above!</div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={todo.done} 
                  onChange={e => toggleDone(todo.id, e.target.checked)} 
                />
                <input 
                  type="text" 
                  defaultValue={todo.text} 
                  onBlur={e => updateText(todo.id, e.target.value)} 
                />
                <input 
                  type="date" 
                  defaultValue={todo.due || ''} 
                  onChange={e => updateDue(todo.id, e.target.value)} 
                />
                <div className="actions">
                  <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
