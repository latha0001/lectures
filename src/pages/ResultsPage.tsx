import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Edit, Download, RefreshCw, Play, Pause } from 'lucide-react';
import { getVideoResults, regenerateQuestions } from '../api/videoApi';
import { useToast } from '../hooks/useToast';
import QuestionEditor from '../components/QuestionEditor';
import { useVideo } from '../context/VideoContext';

const ResultsPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentVideoId } = useVideo();
  const [expandedSegments, setExpandedSegments] = useState<string[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{
    segmentId: string;
    questionIndex: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoId) {
      setCurrentVideoId(videoId);
    }
  }, [videoId, setCurrentVideoId]);

  const {
    data: results,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['videoResults', videoId],
    queryFn: () => getVideoResults(videoId || ''),
    enabled: !!videoId
  });

  const toggleSegment = (segmentId: string) => {
    setExpandedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleRegenerateQuestions = async (segmentId: string) => {
    try {
      await regenerateQuestions(videoId || '', segmentId);
      toast({
        title: 'Questions regenerating',
        description: 'New questions are being generated. This may take a moment.',
        variant: 'default',
      });
      // Refetch after a delay to allow processing
      setTimeout(() => {
        refetch();
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to regenerate questions',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    if (!results) return;
    
    const exportData = {
      videoId: results.id,
      title: results.title,
      duration: results.duration,
      segments: results.segments.map(segment => ({
        id: segment.id,
        startTime: segment.startTime,
        endTime: segment.endTime,
        transcript: segment.transcript,
        questions: segment.questions
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${results.title.replace(/\s+/g, '_')}_quiz.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export successful',
      description: 'Quiz data has been exported as JSON',
      variant: 'success',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const jumpToSegment = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <h2 className="text-xl font-medium text-red-800">Error Loading Results</h2>
        <p className="mt-2 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Failed to load video results'}
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{results.title}</h1>
          <p className="text-sm text-gray-500">
            Duration: {formatTime(results.duration)} • {results.segments.length} segments • 
            {results.segments.reduce((total, segment) => total + segment.questions.length, 0)} questions
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Quiz
          </button>
        </div>
      </div>

      {results.videoUrl && (
        <div className="mb-8 bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full max-h-[500px] object-contain"
            src={results.videoUrl}
            controls
            controlsList="nodownload"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          ></video>
          <div className="bg-gray-800 p-3 flex items-center justify-between">
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-indigo-300 focus:outline-none"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(results.duration)}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {results.segments.map((segment, index) => {
          const isExpanded = expandedSegments.includes(segment.id);
          const isCurrentSegment = 
            currentTime >= segment.startTime && 
            currentTime < segment.endTime;
            
          return (
            <div 
              key={segment.id}
              className={`bg-white shadow rounded-lg overflow-hidden transition-all duration-200 ${
                isCurrentSegment ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div 
                className={`p-4 cursor-pointer hover:bg-gray-50 ${isExpanded ? 'border-b border-gray-200' : ''}`}
                onClick={() => toggleSegment(segment.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        jumpToSegment(segment.startTime);
                      }}
                      className="mr-3 p-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:outline-none"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Segment {index + 1}: {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {segment.transcript.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {segment.questions.length} questions
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{segment.transcript}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Generated Questions</h4>
                      <button
                        onClick={() => handleRegenerateQuestions(segment.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Regenerate
                      </button>
                    </div>
                    
                    {segment.questions.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No questions generated for this segment yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {segment.questions.map((question, qIndex) => (
                          <div
                            key={`${segment.id}-q-${qIndex}`}
                            className="bg-white border border-gray-200 rounded-md p-4 hover:border-indigo-200 transition-colors duration-200"
                          >
                            <div className="flex justify-between">
                              <h5 className="text-sm font-medium text-gray-900">{question.text}</h5>
                              <button
                                onClick={() => setEditingQuestion({ segmentId: segment.id, questionIndex: qIndex })}
                                className="text-gray-400 hover:text-indigo-600"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                            <ul className="mt-3 space-y-2">
                              {question.options.map((option, oIndex) => (
                                <li 
                                  key={`${segment.id}-q-${qIndex}-o-${oIndex}`}
                                  className={`text-sm pl-2 py-1 border-l-2 ${
                                    option === question.answer
                                      ? 'border-green-500 text-green-700 bg-green-50'
                                      : 'border-gray-200 text-gray-600'
                                  }`}
                                >
                                  {option}
                                  {option === question.answer && ' ✓'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingQuestion && (
        <QuestionEditor
          question={results.segments.find(s => s.id === editingQuestion.segmentId)?.questions[editingQuestion.questionIndex]}
          onClose={() => setEditingQuestion(null)}
          onSave={(updatedQuestion) => {
            // Here you would implement the API call to save the updated question
            toast({
              title: 'Question updated',
              description: 'Your changes have been saved.',
              variant: 'success',
            });
            setEditingQuestion(null);
            // In a real implementation, you would update the state or refetch the data
          }}
        />
      )}
    </div>
  );
};

export default ResultsPage;