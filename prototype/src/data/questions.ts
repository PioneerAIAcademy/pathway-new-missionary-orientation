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
            text: 'Looking at this email, what button should you click to begin activating your Zoom account?',
            expectedAnswer: 'Activate Your Zoom Account',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['Look for the blue button', 'It\'s clearly labeled'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/y7WsNek8aj2k2hK9.png',
            imageAlt: 'Zoom activation email with Activate Your Zoom Account button'
          },
          {
            id: 'Q1-2b',
            text: 'On this Zoom sign-up page, which option is recommended for creating your account password?',
            expectedAnswer: 'Sign Up with a Password',
            type: 'procedural',
            priority: 'MEDIUM',
            hints: ['Look at the bottom of the page', 'The training focuses on this option'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/2e-6GiH7_JEt95uG.png',
            imageAlt: 'Zoom sign-up page showing different sign-up options'
          },
          {
            id: 'Q1-2c',
            text: 'If you are merging an existing Zoom account, what button should you click in the verification email?',
            expectedAnswer: 'Approve the Request',
            type: 'procedural',
            priority: 'MEDIUM',
            hints: ['Look for the blue button', 'It approves the merge'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/a84h4qsh9zV7sj1i.png',
            imageAlt: 'Zoom account merge verification email'
          }
        ]
      },
      {
        id: 2,
        name: 'Access the Student Information System',
        questions: [
          {
            id: 'Q1-3',
            text: 'What is the My Gatherings portal used for?',
            expectedAnswer: 'To view student information, track progress, and manage gatherings',
            type: 'comprehension',
            priority: 'HIGH',
            hints: ['It\'s the central hub for student data', 'You\'ll use it to monitor and organize']
          },
          {
            id: 'Q1-4',
            text: 'Looking at this registration screen, what button should you click after entering your invitation code?',
            expectedAnswer: 'Register',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['It\'s a button on the form', 'You click it after filling in the code'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/TUnfTVelRonBMfbQ.png',
            imageAlt: 'My Gatherings portal registration page with invitation code field'
          },
          {
            id: 'Q1-4b',
            text: 'On this login page, what should you enter in the username field?',
            expectedAnswer: 'Your Church username',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['It\'s the same as FamilySearch or tithing', 'Church account credentials'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/Yy5g2mIvvDtYQkRI.png',
            imageAlt: 'Church account login screen'
          },
          {
            id: 'Q1-4c',
            text: 'How do you know you have successfully logged into My Gatherings? What do you see?',
            expectedAnswer: 'A landing page showing a gathering list',
            type: 'comprehension',
            priority: 'MEDIUM',
            hints: ['Look for your gatherings', 'It shows a list'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/SkQCMZAQBTyNA3XW.png',
            imageAlt: 'My Gatherings portal landing page showing gathering list'
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
            expectedAnswer: 'On the Missionary Services website at missionary.byupathway.org',
            type: 'recall',
            priority: 'MEDIUM',
            hints: ['There\'s a dedicated website for missionaries', 'Look for Missionary Services']
          },
          {
            id: 'Q1-5b',
            text: 'Looking at this login screen, which logo indicates you are on the correct sign-in page?',
            expectedAnswer: 'The Church logo (not Microsoft)',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['Look at the logo on the page', 'Microsoft logo means wrong page'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/Rji_vfIj-K0d4CDY.jpg',
            imageAlt: 'Church of Jesus Christ login page with Church logo'
          },
          {
            id: 'Q1-5c',
            text: 'What email address must you use when logging in to Missionary Services, even though it is not your personal email?',
            expectedAnswer: 'missionary@churchofjesuschrist.org',
            type: 'procedural',
            priority: 'HIGH',
            hints: ['It ends with @churchofjesuschrist.org', 'Everyone uses the same email to start'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/vEVlP4osgp8v5l53.png',
            imageAlt: 'Missionary Services login screen showing email field'
          },
          {
            id: 'Q1-5d',
            text: 'This error screen shows a common login problem. What mistake causes this error?',
            expectedAnswer: 'Using a Gmail, Yahoo, or Microsoft email address instead of @churchofjesuschrist.org',
            type: 'comprehension',
            priority: 'MEDIUM',
            hints: ['Look at what email domain was used', 'The wrong type of email causes this'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/_Qgqn3Ow-J9ZDODn.png',
            imageAlt: 'Error screen showing incorrect email login attempt'
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
            expectedAnswer: 'To store student registration data, academic progress, and identify warning signs like academic struggles or financial issues',
            type: 'comprehension',
            priority: 'HIGH'
          },
          {
            id: 'Q5-2',
            text: 'Looking at this gathering list page, what information can you see about your assigned gatherings?',
            expectedAnswer: 'The gathering list showing your assigned students and group information',
            type: 'procedural',
            priority: 'MEDIUM',
            hints: ['Look at the page layout', 'It shows your gatherings and students'],
            imageUrl: 'https://articulateusercontent.com/rise/courses/fJwTzl1r-7VM_3Y6bjdTrFMnUm0S2JFw/SkQCMZAQBTyNA3XW.png',
            imageAlt: 'My Gatherings portal showing gathering list'
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