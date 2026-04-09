import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

const STORAGE_KEY = 'studyflixProfile_v2';

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let data;
    if (saved) {
      data = JSON.parse(saved);
    } else {
      data = {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        branch: 'Computer Science',
        dateJoined: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        profilePicture: null,
        streak: 0,
        lastVisited: null,
        videosWatched: [],
        activityLog: {},
        inProgressVideos: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Check streak
    const today = new Date().toDateString();
    const lastVisitedStr = data.lastVisited ? new Date(data.lastVisited).toDateString() : null;

    if (lastVisitedStr !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisitedStr === yesterday.toDateString()) {
        data.streak += 1;
      } else if (lastVisitedStr !== today) {
        // If not yesterday and not today, streak resets. Wait, if it's first login, streak=1
        data.streak = 1;
      }
      
      data.lastVisited = new Date().toISOString();

      // Tracking logins to heatmap has been removed as per user request. 

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    
    // Check fallback for old structure
    if (!data.activityLog) data.activityLog = {};
    if (!data.inProgressVideos) data.inProgressVideos = [];
    
    const savedPic = localStorage.getItem('studyflixProfilePic');
    if (savedPic) data.profilePicture = savedPic;

    setProfile(data);
  }, []);

  const updateProfile = (updates) => {
    const newProf = { ...profile, ...updates };
    setProfile(newProf);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProf));
  };
  
  const logActivity = () => {
    const today = new Date().toDateString();
    const actLog = { ...profile.activityLog };
    actLog[today] = (actLog[today] || 0) + 1;
    updateProfile({ activityLog: actLog });
  };

  const startWatching = (videoInfo) => {
    const arr = profile.inProgressVideos || [];
    // If it's already in the list, remove it so it can be pushed to the front
    const filtered = arr.filter(v => v.id !== videoInfo.id);
    const newProgress = [{ ...videoInfo, startedAt: new Date().toISOString() }, ...filtered];
    updateProfile({ inProgressVideos: newProgress });
  };

  const markAsComplete = (videoInfo) => {
    // 1. Log as watched
    const newVideo = {
      ...videoInfo,
      completedId: Date.now(),
      watchedDate: new Date().toISOString()
    };
    const newVideosList = [...(profile.videosWatched || []), newVideo];
    
    // 2. Remove from continue watching
    const arr = profile.inProgressVideos || [];
    const filteredProgress = arr.filter(v => v.id !== videoInfo.id);
    
    // 3. Mark heatmap activity
    const today = new Date().toDateString();
    const actLog = { ...(profile.activityLog || {}) };
    actLog[today] = (actLog[today] || 0) + 1;

    updateProfile({ videosWatched: newVideosList, inProgressVideos: filteredProgress, activityLog: actLog });
  };

  if (!profile) return null; // Wait for load

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, logActivity, startWatching, markAsComplete }}>
      {children}
    </ProfileContext.Provider>
  );
};
