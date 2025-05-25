import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
  currentVideoId: string | null;
  setCurrentVideoId: (id: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ currentVideoId, setCurrentVideoId }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};