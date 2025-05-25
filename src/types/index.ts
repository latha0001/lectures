export interface VideoStatus {
  id: string;
  title: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  stage: 'upload' | 'transcription' | 'segmentation' | 'question_generation' | 'complete';
  error?: string;
}

export interface Question {
  text: string;
  options: string[];
  answer: string;
}

export interface VideoSegment {
  id: string;
  startTime: number;
  endTime: number;
  transcript: string;
  questions: Question[];
}

export interface VideoResults {
  id: string;
  title: string;
  duration: number;
  videoUrl: string | null;
  createdAt: string;
  segments: VideoSegment[];
}