export interface Question {
  id: string;
  text: string;
  expectedAnswer: string;
  type: 'comprehension' | 'procedural' | 'recall';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  hints?: string[];
  imageUrl?: string; // Optional image for the question
  imageAlt?: string; // Alt text for accessibility
}

export interface Topic {
  id: number;
  name: string;
  questions: Question[];
}

export interface Module {
  id: number;
  name: string;
  topics: Topic[];
  estimatedMinutes: number;
}

export const MODULES: Module[] = [
  {
    id: 1,
    name: 'Access to Essential Systems',
    estimatedMinutes: 8,
    topics: [
      {
        id: 1,
        name: 'Access to a Zoom Account',
        questions: [
          {
            id: 'Q1-1',
            text: 'What type of Zoom account do BYU-Pathway missionaries use for virtual gatherings?',
            expectedAnswer: 'A Church-issued Zoom account',
            type: 'recall',
            priority: 'HIGH',
            hints: ['Think about who provides the account', 'It\'s not a personal account']
          },
          {
            id: 'Q1-2',
            text: 'How do you activate your Church-issued Zoom account?',
            expectedAnswer: 'Use your Church Account username and password to sign in and activate it',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['You use existing Church credentials', 'No separate registration needed']
          }
        ]
      },
      {
        id: 2,
        name: 'Access the Student Information System',
        questions: [
          {
            id: 'Q1-3',
            text: 'What is the Student Information System used for?',
            expectedAnswer: 'To view student information, track progress, and manage gatherings',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['It\'s the central hub for student data', 'You\'ll use it to monitor and organize']
          },
          {
            id: 'Q1-4',
            text: 'How do you access the Student Information System?',
            expectedAnswer: 'Through the missionary portal using your Church Account credentials',
            type: 'procedural',
            priority: 'MEDIUM'
          }
        ]
      },
      {
        id: 3,
        name: 'Access to Resources and Ongoing Training Material',
        questions: [
          {
            id: 'Q1-5',
            text: 'Where can you find ongoing training materials and resources?',
            expectedAnswer: 'In the missionary resource portal and training library',
            type: 'recall',
            priority: 'MEDIUM',
            hints: ['There\'s a dedicated portal for missionaries', 'Look for the resource library']
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Zoom for Virtual Gatherings',
    estimatedMinutes: 12,
    topics: [
      {
        id: 4,
        name: 'Download and Install the Zoom App',
        questions: [
          {
            id: 'Q2-1',
            text: 'Should you use the web browser version or desktop app for Zoom gatherings?',
            expectedAnswer: 'The desktop app is recommended for better performance and features',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['Desktop app has more features', 'It\'s more reliable than browser']
          }
        ]
      },
      {
        id: 5,
        name: 'How to Open Your Zoom Room',
        questions: [
          {
            id: 'Q2-2',
            text: 'How do you open your assigned Zoom room?',
            expectedAnswer: 'Sign in to Zoom with your Church Account and start your Personal Meeting Room',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['Use your Church Account to sign in', 'Look for Personal Meeting Room']
          }
        ]
      },
      {
        id: 6,
        name: 'Learn Your Zoom Room Tools',
        questions: [
          {
            id: 'Q2-3',
            text: 'What are the essential Zoom controls you need to know for gatherings?',
            expectedAnswer: 'Mute/unmute, video on/off, screen share, chat, and participants panel',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['Think about audio, video, and interaction tools', 'You need to manage participants too']
          },
          {
            id: 'Q2-4',
            text: 'How do you share your screen in Zoom?',
            expectedAnswer: 'Click the Share Screen button and select the window or application to share',
            type: 'procedural',
            priority: 'HIGH'
          }
        ]
      },
      {
        id: 7,
        name: 'Share Your Zoom Room Link',
        questions: [
          {
            id: 'Q2-5',
            text: 'How do students join your Zoom gathering?',
            expectedAnswer: 'You share your Personal Meeting Room link with them via email or the student portal',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['You have a permanent meeting room link', 'Students can join using this link']
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Contacting Your Students',
    estimatedMinutes: 10,
    topics: [
      {
        id: 8,
        name: 'Who Are Your Students',
        questions: [
          {
            id: 'Q3-1',
            text: 'Where can you find information about your assigned students?',
            expectedAnswer: 'In the Student Information System under My Students or My Gatherings',
            type: 'recall',
            priority: 'HIGH'
          },
          {
            id: 'Q3-2',
            text: 'What information can you see about each student?',
            expectedAnswer: 'Name, contact information, enrollment status, and progress',
            type: 'comprehension',
            priority: 'MEDIUM'
          }
        ]
      },
      {
        id: 9,
        name: 'Contact Your Students',
        questions: [
          {
            id: 'Q3-3',
            text: 'What are the recommended ways to contact students?',
            expectedAnswer: 'Email through the system, phone calls, or text messages',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['Multiple methods available', 'System has built-in email']
          }
        ]
      },
      {
        id: 10,
        name: 'Send an Email Message or Group Chat',
        questions: [
          {
            id: 'Q3-4',
            text: 'How do you send a group email to all your students?',
            expectedAnswer: 'Use the bulk email feature in the Student Information System',
            type: 'procedural',
            priority: 'MEDIUM',
            hints: ['There\'s a bulk or group email option', 'Find it in the student system']
          }
        ]
      },
      {
        id: 11,
        name: 'New Student Visits',
        questions: [
          {
            id: 'Q3-5',
            text: 'What should you do when you get a new student assigned?',
            expectedAnswer: 'Contact them within 24-48 hours to introduce yourself and invite them to the gathering',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['Timing is important', 'Make them feel welcome quickly']
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Your First Gathering',
    estimatedMinutes: 8,
    topics: [
      {
        id: 12,
        name: 'Your Role in the First Gathering',
        questions: [
          {
            id: 'Q4-1',
            text: 'What is your primary role as a missionary in gatherings?',
            expectedAnswer: 'To facilitate spiritual learning, encourage students, and help them progress',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['You\'re a facilitator, not a lecturer', 'Focus on spiritual development']
          }
        ]
      },
      {
        id: 13,
        name: 'Lead and Observing Students',
        questions: [
          {
            id: 'Q4-2',
            text: 'What should you observe about students during gatherings?',
            expectedAnswer: 'Their engagement, understanding, participation, and any struggles they might have',
            type: 'comprehension',
            priority: 'MEDIUM'
          }
        ]
      },
      {
        id: 14,
        name: 'Former PathwayConnect Completer',
        questions: [
          {
            id: 'Q4-3',
            text: 'How should you work with students who have completed PathwayConnect before?',
            expectedAnswer: 'Recognize their experience and potentially have them mentor newer students',
            type: 'comprehension',
            priority: 'MEDIUM',
            hints: ['They have valuable experience', 'They can help others']
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Student Information System',
    estimatedMinutes: 8,
    topics: [
      {
        id: 15,
        name: 'My Gatherings Portal and Student Information',
        questions: [
          {
            id: 'Q5-1',
            text: 'What is the My Gatherings portal used for?',
            expectedAnswer: 'To manage gathering schedules, view student lists, and track attendance',
            type: 'comprehension',
            priority: 'HIGH'
          },
          {
            id: 'Q5-2',
            text: 'Where do you find your student list for your assigned gathering?',
            expectedAnswer: 'In the My Gatherings portal under the student list section',
            type: 'procedural',
            priority: 'MEDIUM',
            hints: ['Look in the My Gatherings portal', 'There\'s a dedicated student list view'],
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            imageAlt: 'Screenshot of student information system portal'
          }
        ]
      },
      {
        id: 16,
        name: 'Monitor Student Progress',
        questions: [
          {
            id: 'Q5-3',
            text: 'How can you track if students are completing their coursework?',
            expectedAnswer: 'Check the progress indicators and completion status in the Student Information System',
            type: 'procedural',
            priority: 'HIGH'
          }
        ]
      },
      {
        id: 17,
        name: 'Create Gathering Meeting Outlines',
        questions: [
          {
            id: 'Q5-4',
            text: 'Are gathering outlines provided, or do you create your own?',
            expectedAnswer: 'Templates and outlines are provided in the resource library',
            type: 'recall',
            priority: 'MEDIUM',
            hints: ['You don\'t start from scratch', 'Resources are available']
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Next Steps in Training',
    estimatedMinutes: 5,
    topics: [
      {
        id: 18,
        name: 'Missionary Training and Resources',
        questions: [
          {
            id: 'Q6-1',
            text: 'What ongoing training is available to missionaries?',
            expectedAnswer: 'Regular training sessions, resource library, and support from orientation trainers',
            type: 'recall',
            priority: 'MEDIUM'
          }
        ]
      },
      {
        id: 19,
        name: 'Your Orientation Trainer',
        questions: [
          {
            id: 'Q6-2',
            text: 'Who should you contact if you have questions after orientation?',
            expectedAnswer: 'Your orientation trainer or zone leaders',
            type: 'recall',
            priority: 'HIGH',
            hints: ['You have dedicated support', 'Multiple people can help']
          }
        ]
      }
    ]
  }
];

export const TRAINING_LINKS: Record<number, string> = {
  1: 'https://rise.articulate.com/share/access-essential-systems',
  2: 'https://rise.articulate.com/share/zoom-virtual-gatherings',
  3: 'https://rise.articulate.com/share/contacting-students',
  4: 'https://rise.articulate.com/share/first-gathering',
  5: 'https://rise.articulate.com/share/student-information-system',
  6: 'https://rise.articulate.com/share/next-steps-training'
};

// Get total question count
export const getTotalQuestionCount = (selectedModules?: number[]): number => {
  const modules = selectedModules 
    ? MODULES.filter(m => selectedModules.includes(m.id))
    : MODULES;
  
  return modules.reduce((total, module) => {
    return total + module.topics.reduce((topicTotal, topic) => {
      return topicTotal + topic.questions.length;
    }, 0);
  }, 0);
};

// Get all questions in order
export const getAllQuestions = (selectedModules?: number[]): Array<Question & { moduleId: number; topicId: number; moduleName: string; topicName: string }> => {
  const modules = selectedModules 
    ? MODULES.filter(m => selectedModules.includes(m.id))
    : MODULES;
  
  const questions: Array<Question & { moduleId: number; topicId: number; moduleName: string; topicName: string }> = [];
  
  modules.forEach(module => {
    module.topics.forEach(topic => {
      topic.questions.forEach(question => {
        questions.push({
          ...question,
          moduleId: module.id,
          topicId: topic.id,
          moduleName: module.name,
          topicName: topic.name
        });
      });
    });
  });
  
  return questions;
};