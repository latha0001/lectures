import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getVideoStatus } from '../api/videoApi';
import { useVideo } from '../context/VideoContext';

const ProcessingPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { setCurrentVideoId } = useVideo();
  
  useEffect(() => {
    if (videoId) {
      setCurrentVideoId(videoId);
    }
  }, [videoId, setCurrentVideoId]);

  const { data: status, error, isLoading } = useQuery({
    queryKey: ['videoStatus', videoId],
    queryFn: () => getVideoStatus(videoId || ''),
    refetchInterval: (data) => {
      // Stop polling when processing is complete or failed
      return data?.status === 'completed' || data?.status === 'failed' ? false : 3000;
    },
    enabled: !!videoId,
  });

  useEffect(() => {
    if (status?.status === 'completed') {
      // Navigate to results page after a short delay
      const timer = setTimeout(() => {
        navigate(`/results/${videoId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, videoId, navigate]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking video status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="mt-2 text-lg font-medium text-red-800">Error</h2>
        <p className="mt-2 text-sm text-red-700">
          An error occurred while checking the video status.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="mt-2 text-lg font-medium text-red-800">Video Not Found</h2>
        <p className="mt-2 text-sm text-red-700">
          We couldn't find the video you're looking for.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    switch (status.stage) {
      case 'upload':
        return 20;
      case 'transcription':
        return 50;
      case 'segmentation':
        return 70;
      case 'question_generation':
        return 90;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  };

  const getStageLabel = () => {
    switch (status.stage) {
      case 'upload':
        return 'Processing upload';
      case 'transcription':
        return 'Transcribing video';
      case 'segmentation':
        return 'Segmenting transcript';
      case 'question_generation':
        return 'Generating questions';
      case 'complete':
        return 'Processing complete';
      default:
        return 'Processing';
    }
  };

  if (status.status === 'failed') {
    return (
      <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="mt-2 text-lg font-medium text-red-800">Processing Failed</h2>
        <p className="mt-2 text-sm text-red-700">
          {status.error || 'An error occurred while processing your video.'}
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/upload')}
            className="mr-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Processing Your Video</h1>
        <p className="mt-2 text-gray-600">
          Your video is being processed. This may take several minutes depending on the length.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{status.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {status.status === 'completed' ? 'Processing complete' : 'Processing in progress...'}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <span>{getStageLabel()}</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center ring-8 ring-white">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Video uploaded successfully</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative pb-8">
                      {status.stage !== 'transcription' && status.stage !== 'upload' && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          {status.stage === 'transcription' ? (
                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-white animate-pulse" />
                            </span>
                          ) : status.stage !== 'upload' ? (
                            <span className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className={`text-sm ${status.stage === 'transcription' ? 'text-indigo-600 font-medium' : status.stage !== 'upload' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Transcribing video content
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative pb-8">
                      {status.stage !== 'segmentation' && status.stage !== 'upload' && status.stage !== 'transcription' && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          {status.stage === 'segmentation' ? (
                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-white animate-pulse" />
                            </span>
                          ) : status.stage !== 'upload' && status.stage !== 'transcription' ? (
                            <span className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className={`text-sm ${status.stage === 'segmentation' ? 'text-indigo-600 font-medium' : status.stage !== 'upload' && status.stage !== 'transcription' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Segmenting transcript into chunks
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div>
                          {status.stage === 'question_generation' ? (
                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-white animate-pulse" />
                            </span>
                          ) : status.stage === 'complete' ? (
                            <span className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </span>
                          ) : (
                            <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className={`text-sm ${status.stage === 'question_generation' ? 'text-indigo-600 font-medium' : status.stage === 'complete' ? 'text-gray-500' : 'text-gray-400'}`}>
                              Generating quiz questions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;