import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Film, Clock, List, ArrowRight, Upload } from 'lucide-react';
import { fetchVideos } from '../api/videoApi';
import { formatDuration, formatDate } from '../utils/formatters';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    initialData: []
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Video Dashboard</h1>
        <button
          onClick={() => navigate('/upload')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload New Video
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your videos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          An error occurred while loading your videos. Please try again.
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Film className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No videos yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first video for transcription and quiz generation.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/upload')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload a Video
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {videos.map((video) => (
              <li key={video.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 cursor-pointer" 
                     onClick={() => navigate(`/results/${video.id}`)}>
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-indigo-600 truncate">{video.title}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          {video.status === 'completed' 
                            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>
                            : video.status === 'processing' 
                              ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Processing</span>
                              : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>
                          }
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500 mr-6">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>{formatDuration(video.duration)}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <List className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>{video.questionCount} questions</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex items-center">
                      <p className="text-sm text-gray-500 mr-4">{formatDate(video.createdAt)}</p>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;