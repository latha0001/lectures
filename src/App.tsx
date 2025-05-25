import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import { Toaster } from './components/ui/Toaster';
import { VideoProvider } from './context/VideoContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VideoProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/processing/:videoId" element={<ProcessingPage />} />
              <Route path="/results/:videoId" element={<ResultsPage />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </VideoProvider>
    </QueryClientProvider>
  );
}

export default App;