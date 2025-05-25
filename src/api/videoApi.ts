import { VideoStatus, VideoResults } from '../types';

// Mock data for development purposes
const mockVideos = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    duration: 3720, // 1 hour 2 minutes
    status: 'completed',
    createdAt: new Date().toISOString(),
    questionCount: 52
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    duration: 2850, // 47 minutes 30 seconds
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    questionCount: 38
  },
  {
    id: '3',
    title: 'Advanced Database Systems',
    duration: 4500, // 1 hour 15 minutes
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    questionCount: 0
  }
];

const mockResults: Record<string, VideoResults> = {
  '1': {
    id: '1',
    title: 'Introduction to Computer Science',
    duration: 3720,
    videoUrl: 'https://example.com/video1.mp4', // In a real app, this would be a valid URL
    createdAt: new Date().toISOString(),
    segments: [
      {
        id: 'seg1',
        startTime: 0,
        endTime: 300,
        transcript: "Welcome to Introduction to Computer Science. In this course, we'll be exploring the fundamental concepts of computing, algorithms, and programming. Computer science is about problem-solving using computers. It involves the study of algorithms, which are step-by-step procedures for solving problems, and data structures, which are ways of organizing and storing data.",
        questions: [
          {
            text: "What is the main focus of computer science according to the lecture?",
            options: [
              "Building computers and hardware",
              "Problem-solving using computers",
              "Creating websites and mobile apps",
              "Learning programming languages"
            ],
            answer: "Problem-solving using computers"
          },
          {
            text: "What are algorithms as defined in the lecture?",
            options: [
              "Mathematical equations",
              "Computer programs",
              "Step-by-step procedures for solving problems",
              "Data organization methods"
            ],
            answer: "Step-by-step procedures for solving problems"
          },
          {
            text: "What does the study of computer science involve?",
            options: [
              "Only programming languages",
              "Only hardware design",
              "Algorithms and data structures",
              "Only software applications"
            ],
            answer: "Algorithms and data structures"
          }
        ]
      },
      {
        id: 'seg2',
        startTime: 300,
        endTime: 600,
        transcript: "Let's begin by discussing what programming is. Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions are written in programming languages, which are formal languages designed to communicate instructions to a machine. There are many programming languages, such as Python, Java, C++, and JavaScript, each with its own syntax and use cases.",
        questions: [
          {
            text: "What is programming according to the lecture?",
            options: [
              "Writing documentation for software",
              "Creating a set of instructions for computers",
              "Designing user interfaces",
              "Testing software applications"
            ],
            answer: "Creating a set of instructions for computers"
          },
          {
            text: "Which of the following is NOT mentioned as a programming language in the lecture?",
            options: [
              "Python",
              "Java",
              "C++",
              "Ruby"
            ],
            answer: "Ruby"
          }
        ]
      },
      {
        id: 'seg3',
        startTime: 600,
        endTime: 900,
        transcript: "Now, let's talk about data structures. Data structures are ways of organizing and storing data so that it can be accessed and modified efficiently. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. The choice of data structure can significantly impact the performance of an algorithm, so it's essential to understand their properties and use cases.",
        questions: [
          {
            text: "What is the purpose of data structures according to the lecture?",
            options: [
              "To make code look neat and organized",
              "To organize data for efficient access and modification",
              "To encrypt sensitive information",
              "To compress data for storage"
            ],
            answer: "To organize data for efficient access and modification"
          },
          {
            text: "Which data structure is NOT mentioned in the lecture?",
            options: [
              "Arrays",
              "Linked lists",
              "Hash tables",
              "Stacks"
            ],
            answer: "Hash tables"
          },
          {
            text: "According to the lecture, what impact can the choice of data structure have?",
            options: [
              "It can affect the visual design of the application",
              "It can impact the performance of an algorithm",
              "It determines which programming language must be used",
              "It influences the hardware requirements"
            ],
            answer: "It can impact the performance of an algorithm"
          }
        ]
      }
    ]
  }
};

// Basic simulation of API endpoints with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all videos
export const fetchVideos = async (): Promise<any[]> => {
  await delay(1000); // Simulate network delay
  return mockVideos;
};

// Upload a video
export const uploadVideo = async (
  file: File, 
  title: string,
  onProgress?: (progress: number) => void
): Promise<{ videoId: string }> => {
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    if (progress > 100) {
      clearInterval(interval);
      return;
    }
    onProgress?.(progress);
  }, 300);

  await delay(6000); // Simulate upload time
  clearInterval(interval);
  onProgress?.(100);
  
  const newId = (mockVideos.length + 1).toString();
  const newVideo = {
    id: newId,
    title,
    duration: Math.floor(Math.random() * 3600) + 1800, // Random duration between 30-90 minutes
    status: 'processing',
    createdAt: new Date().toISOString(),
    questionCount: 0
  };
  
  mockVideos.push(newVideo);
  
  return { videoId: newId };
};

// Get video processing status
export const getVideoStatus = async (videoId: string): Promise<VideoStatus> => {
  await delay(500);
  
  const video = mockVideos.find(v => v.id === videoId);
  if (!video) {
    throw new Error("Video not found");
  }
  
  // Simulate the different processing stages
  let stage = 'upload';
  if (video.status === 'completed') {
    stage = 'complete';
  } else if (Date.now() % 4 === 0) {
    stage = 'transcription';
  } else if (Date.now() % 4 === 1) {
    stage = 'segmentation';
  } else if (Date.now() % 4 === 2) {
    stage = 'question_generation';
  }
  
  return {
    id: video.id,
    title: video.title,
    status: video.status,
    stage,
    error: video.status === 'failed' ? 'Processing failed due to an error' : undefined
  };
};

// Get video results
export const getVideoResults = async (videoId: string): Promise<VideoResults> => {
  await delay(1500);
  
  // Check if we have mock results for this video
  if (mockResults[videoId]) {
    return mockResults[videoId];
  }
  
  // If not, create some dummy results for demo purposes
  const video = mockVideos.find(v => v.id === videoId);
  if (!video) {
    throw new Error("Video not found");
  }
  
  // Create mock segments with transcripts and questions
  const segments = [];
  const segmentCount = Math.floor(video.duration / 300); // 5-minute segments
  
  for (let i = 0; i < segmentCount; i++) {
    segments.push({
      id: `${videoId}-seg-${i}`,
      startTime: i * 300,
      endTime: (i + 1) * 300,
      transcript: `This is a sample transcript for segment ${i+1}. In a real application, this would contain the actual transcribed content from the video for this 5-minute segment.`,
      questions: i < 3 ? [
        {
          text: `Sample question ${i+1} about the content in this segment?`,
          options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
          ],
          answer: "Option B"
        },
        {
          text: `Another sample question ${i+1} testing understanding of the material?`,
          options: [
            "First choice",
            "Second choice",
            "Third choice",
            "Fourth choice"
          ],
          answer: "Third choice"
        }
      ] : []
    });
  }
  
  const results: VideoResults = {
    id: videoId,
    title: video.title,
    duration: video.duration,
    videoUrl: null, // In a real app, this would be a valid URL
    createdAt: video.createdAt,
    segments
  };
  
  // Store in our mock results
  mockResults[videoId] = results;
  
  return results;
};

// Regenerate questions for a segment
export const regenerateQuestions = async (videoId: string, segmentId: string): Promise<void> => {
  await delay(2000);
  
  const results = mockResults[videoId];
  if (!results) {
    throw new Error("Video not found");
  }
  
  const segment = results.segments.find(s => s.id === segmentId);
  if (!segment) {
    throw new Error("Segment not found");
  }
  
  // In a real app, this would call the AI service to generate new questions
  // For demo purposes, we'll just create some new mock questions
  segment.questions = [
    {
      text: `Newly generated question 1 for segment ${segmentId}?`,
      options: [
        "New option A",
        "New option B",
        "New option C",
        "New option D"
      ],
      answer: "New option A"
    },
    {
      text: `Newly generated question 2 for segment ${segmentId}?`,
      options: [
        "First new choice",
        "Second new choice",
        "Third new choice",
        "Fourth new choice"
      ],
      answer: "Second new choice"
    },
    {
      text: `Newly generated question 3 for segment ${segmentId}?`,
      options: [
        "Additional choice 1",
        "Additional choice 2",
        "Additional choice 3",
        "Additional choice 4"
      ],
      answer: "Additional choice 3"
    }
  ];
};