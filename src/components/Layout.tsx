import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center" onClick={() => navigate('/')} role="button">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LectureQuiz</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Video className="mr-1.5 h-4 w-4" />
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/upload')}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <BookOpen className="mr-1.5 h-4 w-4" />
                New Upload
              </button>
            </nav>
            
            <div className="md:hidden">
              {/* Mobile menu button - we would implement a proper mobile menu in a full version */}
              <button className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2025 LectureQuiz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;