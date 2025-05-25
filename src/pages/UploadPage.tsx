import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, FileVideo, Check, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { uploadVideo } from '../api/videoApi';
import { useToast } from '../hooks/useToast';
import { useVideo } from '../context/VideoContext';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentVideoId } = useVideo();

  const uploadMutation = useMutation({
    mutationFn: (data: { file: File; title: string }) => {
      return uploadVideo(data.file, data.title, (progress) => {
        setUploadProgress(progress);
      });
    },
    onSuccess: (response) => {
      setCurrentVideoId(response.videoId);
      toast({
        title: 'Upload successful',
        description: 'Your video is now being processed.',
        variant: 'success',
      });
      navigate(`/processing/${response.videoId}`);
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      setUploadProgress(0);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!file.type.includes('video/mp4')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an MP4 video file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 500MB.',
        variant: 'destructive',
      });
      return;
    }

    setFile(file);
    if (!title) {
      // Set a default title based on the filename (without extension)
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a video file to upload.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your video.',
        variant: 'destructive',
      });
      return;
    }

    uploadMutation.mutate({ file, title });
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Upload Video</h1>
        <p className="mt-2 text-gray-600">
          Upload an MP4 lecture video to transcribe and generate quiz questions
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter a title for your video"
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-indigo-400'
          } transition-colors duration-200 ease-in-out`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="hidden"
            id="video-upload"
          />

          {!file ? (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Upload className="h-12 w-12" />
              </div>
              <div className="text-sm text-gray-600">
                <label
                  htmlFor="video-upload"
                  className="relative cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload a video</span>
                </label>{' '}
                or drag and drop
              </div>
              <p className="text-xs text-gray-500">MP4 up to 500MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileVideo className="h-8 w-8 text-green-500" />
                <Check className="h-5 w-5 text-green-500 -ml-2 -mt-5" />
              </div>
              <div className="text-sm font-medium text-gray-900 flex items-center justify-center">
                {file.name}
                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Uploading...</span>
              <span>{uploadProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              !file || uploadMutation.isPending
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {uploadMutation.isPending ? (
              <>
                <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </button>
        </div>

        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This application processes videos locally. Larger videos may take longer to process.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;