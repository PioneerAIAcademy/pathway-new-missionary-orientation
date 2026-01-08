// Questions and Answers Data
// Extracted from questions_and_answers.txt

export const QUESTIONS = {
  // Page 1: Introduction
  intro: {
    module: 'Introduction',
    moduleId: 0,
    title: 'Introduction to Serving with BYU-Pathway Worldwide',
    questions: [
      {
        id: 'intro-1',
        question: 'What are the six missionary responsibilities outlined for serving with BYU-Pathway Worldwide?',
        expectedAnswer: 'The six missionary responsibilities are: inviting others to come unto Christ, ministering to and shepherding your students, making your gathering a sacred place, finding potential students within your community, guiding students in their educational goals, and supporting other missionaries with whom you associate.',
        type: 'comprehension',
        keyConcept: 'Understanding the specific responsibilities of missionaries in the BYU-Pathway Worldwide program.'
      },
      {
        id: 'intro-2',
        question: 'How should new missionaries expect to be contacted to begin their service?',
        expectedAnswer: 'New missionaries should expect to be contacted by a missionary orientation trainer through a phone call, text, WhatsApp message, or email.',
        type: 'comprehension',
        keyConcept: 'Knowing the process for initiating service as a missionary with BYU-Pathway Worldwide.'
      },
      {
        id: 'intro-3',
        question: 'In what ways can the learning modules aid missionaries in their responsibilities?',
        expectedAnswer: 'The learning modules can strengthen the missionaries\' responsibilities, help them prepare for their first gathering with students, and offer new skills while supplementing what they already know.',
        type: 'analysis',
        keyConcept: 'Evaluating the purpose and benefits of learning modules for missionaries in their service.'
      }
    ]
  },

  // Module 1: Access to Essential Systems
  module1: {
    module: 'Module 1: Access to Essential Systems',
    moduleId: 1,
    title: 'Access to Essential Systems',
    pages: [
      // Page 2: Access to a Zoom Account
      {
        pageId: 2,
        pageTitle: 'Access to a Zoom Account',
        questions: [
          {
            id: 'm1p2-1',
            question: 'What type of Zoom account is necessary for missionaries assigned to BYU-Pathway who will be facilitating virtual gatherings?',
            expectedAnswer: 'A Church issued Zoom account is necessary for missionaries assigned to BYU-Pathway who will be facilitating virtual gatherings.',
            type: 'comprehension',
            keyConcept: 'Importance of the correct Zoom account for facilitating virtual gatherings.'
          },
          {
            id: 'm1p2-2',
            question: 'If a missionary currently has a paid Zoom account, what steps must they take to comply with BYU-Pathway\'s requirements?',
            expectedAnswer: 'They must create a new Zoom account through BYU-Pathway and provide their trainer with an email address for the new account, as they cannot upgrade a paid business account.',
            type: 'application',
            keyConcept: 'Procedures for obtaining the correct Zoom account when already having a paid account.'
          },
          {
            id: 'm1p2-3',
            question: 'What should a user do if they do not receive the activation email for their new Zoom account?',
            expectedAnswer: 'They should check their spam folder for the activation email sent from no-reply@zoom.us.',
            type: 'analysis',
            keyConcept: 'Troubleshooting steps for account activation issues.'
          }
        ]
      },
      // Page 3: Access the Student Information System
      {
        pageId: 3,
        pageTitle: 'Access the Student Information System',
        questions: [
          {
            id: 'm1p3-1',
            question: 'What is the purpose of the My Gatherings portal?',
            expectedAnswer: 'The My Gatherings portal is where you access student information.',
            type: 'comprehension',
            keyConcept: 'Purpose of the My Gatherings portal'
          },
          {
            id: 'm1p3-2',
            question: 'What should you do if you do not receive the email with the login link and invitation code?',
            expectedAnswer: 'If you do not receive the email, your trainer will be in contact with you soon.',
            type: 'application',
            keyConcept: 'Steps to take when login information is not received'
          },
          {
            id: 'm1p3-3',
            question: 'How can you confirm that you have successfully logged into the My Gatherings portal?',
            expectedAnswer: 'You have successfully logged in if you see a landing page showing a gathering list.',
            type: 'comprehension',
            keyConcept: 'Confirmation of successful login to the portal'
          }
        ]
      },
      // Page 4: Access to Resources and Ongoing Training Material
      {
        pageId: 4,
        pageTitle: 'Access to Resources and Ongoing Training Material',
        questions: [
          {
            id: 'm1p4-1',
            question: 'What should you ensure about your Church account password before logging in to the Missionary Services website?',
            expectedAnswer: 'You should ensure that your Church account password is 12 or more characters to avoid your access being locked.',
            type: 'comprehension',
            keyConcept: 'Importance of password requirements for access.'
          },
          {
            id: 'm1p4-2',
            question: 'What email address format must be used when signing in to the Missionary Services website?',
            expectedAnswer: 'You must use an @churchofjesuschrist.org email address when signing in.',
            type: 'comprehension',
            keyConcept: 'Required email format for logging in.'
          },
          {
            id: 'm1p4-3',
            question: 'If you encounter issues logging in to the Missionary Services website, what is one recommended troubleshooting step?',
            expectedAnswer: 'One recommended troubleshooting step is to type in missionary.byupathway.org in your web address bar and log back in.',
            type: 'application',
            keyConcept: 'Troubleshooting steps for access issues.'
          }
        ]
      }
    ]
  },

  // Module 2: Zoom for Virtual Gatherings
  module2: {
    module: 'Module 2: Zoom for Virtual Gatherings',
    moduleId: 2,
    title: 'Zoom for Virtual Gatherings',
    pages: [
      // Page 5: Basic Zoom Skills for Your First Gathering
      {
        pageId: 5,
        pageTitle: 'Basic Zoom Skills for Your First Gathering',
        questions: [
          {
            id: 'm2p5-1',
            question: 'What are the four basic skills you need to master for your first gathering on Zoom?',
            expectedAnswer: 'The four basic skills are downloading and installing the Zoom app, logging in to Zoom, updating your personal profile, and sharing your screen.',
            type: 'comprehension',
            keyConcept: 'Identification of essential Zoom skills for virtual gatherings.'
          },
          {
            id: 'm2p5-2',
            question: 'How can individuals improve their Zoom skills over time according to the lesson?',
            expectedAnswer: 'Individuals can improve their Zoom skills over time by going through additional training material on the Missionary Services website with their zone or district leader.',
            type: 'application',
            keyConcept: 'Continuous learning and skill development in using Zoom.'
          },
          {
            id: 'm2p5-3',
            question: 'Who can individuals practice their Zoom skills with before their first gathering?',
            expectedAnswer: 'Individuals can practice their Zoom skills with their trainer, family, or friends.',
            type: 'comprehension',
            keyConcept: 'Suggested practice partners for enhancing Zoom proficiency.'
          }
        ]
      },
      // Page 6: Download and Install the Zoom App
      {
        pageId: 6,
        pageTitle: 'Download and Install the Zoom App',
        questions: [
          {
            id: 'm2p6-1',
            question: 'What is the recommended app to download for Windows users to have full access to Zoom features?',
            expectedAnswer: 'The recommended app for Windows users is the Zoom Workplace for Windows app.',
            type: 'comprehension',
            keyConcept: 'Importance of using the appropriate Zoom app for full functionality.'
          },
          {
            id: 'm2p6-2',
            question: 'How can a Windows user pin the Zoom app to their taskbar for easy access after installation?',
            expectedAnswer: 'A Windows user can pin the Zoom app to their taskbar by locating the Zoom icon in the Windows start menu, right-clicking it, selecting More, and then choosing Pin to Taskbar.',
            type: 'application',
            keyConcept: 'Steps to enhance accessibility of the Zoom app on a Windows computer.'
          },
          {
            id: 'm2p6-3',
            question: 'What step must a Mac user take regarding security settings before downloading the Zoom Workplace app?',
            expectedAnswer: 'A Mac user must go to the Apple icon, click on System Settings, select Privacy & Security, and under the Security section, choose "Allow applications downloaded from App Store and identified developers."',
            type: 'analysis',
            keyConcept: 'Understanding security settings required for installing applications on a Mac.'
          }
        ]
      },
      // Page 7: How to Open Your Zoom Room
      {
        pageId: 7,
        pageTitle: 'How to Open Your Zoom Room',
        questions: [
          {
            id: 'm2p7-1',
            question: 'What is the first step to open your Zoom room for a meeting?',
            expectedAnswer: 'The first step is to open your Zoom desktop app and click the orange New Meeting icon.',
            type: 'comprehension',
            keyConcept: 'Understanding the initial action required to start a Zoom meeting.'
          },
          {
            id: 'm2p7-2',
            question: 'How can you ensure your microphone automatically activates each time you enter your Zoom room?',
            expectedAnswer: 'You can ensure your microphone automatically activates by clicking the checkbox "Automatically join audio by computer when joining."',
            type: 'application',
            keyConcept: 'Applying settings to enhance user experience in Zoom meetings.'
          },
          {
            id: 'm2p7-3',
            question: 'Why is it important to activate your computer\'s webcam during meetings with students?',
            expectedAnswer: 'It is important to activate your computer\'s webcam during meetings with students to ensure that your camera is on and facilitate better communication.',
            type: 'analysis',
            keyConcept: 'Evaluating the significance of video presence in virtual gatherings.'
          }
        ]
      },
      // Page 8: Learn Your Zoom Room Tools
      {
        pageId: 8,
        pageTitle: 'Learn Your Zoom Room Tools',
        questions: [
          {
            id: 'm2p8-1',
            question: 'How can you view the meeting information, including the meeting ID and host details, in Zoom?',
            expectedAnswer: 'You can view the meeting information by selecting the information icon in the upper-right corner of the screen.',
            type: 'comprehension',
            keyConcept: 'Understanding how to access meeting information in Zoom.'
          },
          {
            id: 'm2p8-2',
            question: 'What steps must you take to mute all participants in a Zoom meeting?',
            expectedAnswer: 'Click the participants icon in the menu bar at the bottom of your screen, then click the Mute All button at the bottom of the window.',
            type: 'application',
            keyConcept: 'Applying knowledge of participant controls in Zoom meetings.'
          },
          {
            id: 'm2p8-3',
            question: 'Describe the process to share your screen during a Zoom meeting.',
            expectedAnswer: 'To share your screen, select the share icon from the menu bar at the bottom of the page, and to access additional sharing settings, click the arrow to the right of the share icon.',
            type: 'analysis',
            keyConcept: 'Analyzing the steps required to utilize the screen sharing feature in Zoom.'
          }
        ]
      },
      // Page 9: How to Update Your Personal Profile
      {
        pageId: 9,
        pageTitle: 'How to Update Your Personal Profile',
        questions: [
          {
            id: 'm2p9-1',
            question: 'What website should you visit to update your personal profile for Zoom?',
            expectedAnswer: 'You should visit byupathway.zoom.us to update your personal profile for Zoom.',
            type: 'comprehension',
            keyConcept: 'Identifying the correct platform for profile updates.'
          },
          {
            id: 'm2p9-2',
            question: 'What steps must you take to update your profile picture and missionary name on Zoom?',
            expectedAnswer: 'To update your profile picture, go to byupathway.zoom.us, sign in, click the Profile tab, click the image placeholder to upload a picture, select Edit to enter your display name, and then click the blue Save button to save your changes.',
            type: 'application',
            keyConcept: 'Understanding and applying the steps for updating a personal profile.'
          },
          {
            id: 'm2p9-3',
            question: 'Why is it important to add a profile picture and missionary name to your Zoom account?',
            expectedAnswer: 'Adding a profile picture and missionary name makes you more approachable online.',
            type: 'analysis',
            keyConcept: 'Evaluating the reasons for enhancing online presence through profile updates.'
          }
        ]
      },
      // Page 10: How to Share Your Screen in Zoom
      {
        pageId: 10,
        pageTitle: 'How to Share Your Screen in Zoom',
        questions: [
          {
            id: 'm2p10-1',
            question: 'What is the first step to share your screen in a Zoom meeting?',
            expectedAnswer: 'The first step is to open your Zoom room and click the Share button in the bottom menu of the Zoom window to view the display options.',
            type: 'comprehension',
            keyConcept: 'Understanding the initial action required to start screen sharing in Zoom.'
          },
          {
            id: 'm2p10-2',
            question: 'How can you share your entire screen instead of just one window when using the Share Screen feature?',
            expectedAnswer: 'To share your entire screen, you need to select the Desktop option when choosing what to display from the available options.',
            type: 'application',
            keyConcept: 'Applying the knowledge of screen sharing options to share the entire desktop.'
          },
          {
            id: 'm2p10-3',
            question: 'What should you do if you want to see what your students are viewing while sharing your screen?',
            expectedAnswer: 'Hover over the green screen sharing indicator located underneath the menu bar, click the arrow icon that appears to drop down a small view screen, and then you can see what your students are seeing.',
            type: 'analysis',
            keyConcept: 'Analyzing how to monitor the screen that students are viewing during a screen share.'
          }
        ]
      },
      // Page 11: Share Your Zoom Room Link
      {
        pageId: 11,
        pageTitle: 'Share Your Zoom Room Link',
        questions: [
          {
            id: 'm2p11-1',
            question: 'How can you find your Zoom meeting link?',
            expectedAnswer: 'You can find your Zoom meeting link by opening your personal Zoom meeting room and clicking the green Information Shield in the top-right corner of the screen, then selecting Copy Link.',
            type: 'comprehension',
            keyConcept: 'Locating the Zoom meeting link'
          },
          {
            id: 'm2p11-2',
            question: 'What should you do when emailing the Zoom link to multiple students?',
            expectedAnswer: 'When emailing the Zoom link to multiple students, you should use Bcc to keep their emails private.',
            type: 'application',
            keyConcept: 'Privacy in email communication'
          },
          {
            id: 'm2p11-3',
            question: 'What additional resources are mentioned for learning more about Zoom?',
            expectedAnswer: 'The lesson mentions that there is much more to learn about Zoom and that you will have an assigned zone or district leader to help you develop additional Zoom skills.',
            type: 'comprehension',
            keyConcept: 'Additional training and resources for Zoom usage'
          }
        ]
      }
    ]
  },

  // Module 3: Contacting Your Students
  module3: {
    module: 'Module 3: Contacting Your Students',
    moduleId: 3,
    title: 'Contacting Your Students',
    pages: [
      // Page 12: Who Are Your Students
      {
        pageId: 12,
        pageTitle: 'Who Are Your Students',
        questions: [
          {
            id: 'm3p12-1',
            question: 'What challenges might students face before reaching out for higher education?',
            expectedAnswer: 'Students may face challenges such as previous failures in higher education, being away from studies for years, complicated lives with long work hours and family responsibilities, limited time, living in poverty, costly internet connections, and lacking English proficiency.',
            type: 'comprehension',
            keyConcept: 'Understanding the various challenges faced by students in higher education.'
          },
          {
            id: 'm3p12-2',
            question: 'How might an educator help students who are unfamiliar with Church terminology and customs?',
            expectedAnswer: 'An educator can approach these students by being patient, using clear and simple language, providing explanations of unfamiliar terms, and creating a welcoming environment that encourages questions and open communication.',
            type: 'application',
            keyConcept: 'Strategies for supporting students new to Church customs and terminology.'
          },
          {
            id: 'm3p12-3',
            question: 'Why is it important to consider students\' backgrounds and situations when contacting them?',
            expectedAnswer: 'It is important to consider students\' backgrounds and situations to foster empathy, build trust, and tailor communication methods that can help students feel confident and successful in their educational journey.',
            type: 'analysis',
            keyConcept: 'The significance of understanding students\' diverse backgrounds in communication.'
          }
        ]
      },
      // Page 13: Contact Your Students
      {
        pageId: 13,
        pageTitle: 'Contact Your Students',
        questions: [
          {
            id: 'm3p13-1',
            question: 'Why is early contact with students considered critical for their success in the first term?',
            expectedAnswer: 'Early contact is believed to bless students and is critical for their success as it fosters communication and support right from the beginning of the term.',
            type: 'comprehension',
            keyConcept: 'Importance of early communication in student success'
          },
          {
            id: 'm3p13-2',
            question: 'What steps must you follow to access your student list in My Gatherings?',
            expectedAnswer: 'First, log in to My Gatherings, then click the Students tab in the navigation bar to access the main students page where you can view your student list.',
            type: 'application',
            keyConcept: 'Navigating the My Gatherings portal to find student information'
          },
          {
            id: 'm3p13-3',
            question: 'What should you remember regarding student information while contacting them?',
            expectedAnswer: 'You should keep student information confidential and only share student contact information with the student\'s permission.',
            type: 'comprehension',
            keyConcept: 'Confidentiality and privacy of student information'
          }
        ]
      },
      // Page 14: Send an Email Message or Group Chat
      {
        pageId: 14,
        pageTitle: 'Send an Email Message or Group Chat',
        questions: [
          {
            id: 'm3p14-1',
            question: 'What are some recommended methods for introducing yourself to your students?',
            expectedAnswer: 'Recommended methods include sending an email, text, phone call, Facebook Messenger, or WhatsApp message.',
            type: 'comprehension',
            keyConcept: 'Preferred contact methods for student introductions.'
          },
          {
            id: 'm3p14-2',
            question: 'How can you find a student\'s email address in the My Gatherings portal?',
            expectedAnswer: 'You can find a student\'s email address by clicking the Students tab in the top navigation bar and scrolling down to the center table to see the student list, which includes a column for email addresses.',
            type: 'application',
            keyConcept: 'Locating student email addresses in the My Gatherings portal.'
          },
          {
            id: 'm3p14-3',
            question: 'What should you consider when adding students to a WhatsApp group message?',
            expectedAnswer: 'You should only add students to the group text that give permission, as some may prefer to keep their contact information private.',
            type: 'analysis',
            keyConcept: 'Respecting student privacy in group messaging.'
          }
        ]
      },
      // Page 15: New Student Visits
      {
        pageId: 15,
        pageTitle: 'New Student Visits',
        questions: [
          {
            id: 'm3p15-1',
            question: 'Why is it important to personally visit each new student at the beginning of their first term?',
            expectedAnswer: 'It is important to personally visit each new student to help ease their fears or concerns about attending, and to begin a friendship that will support them in their educational journey.',
            type: 'comprehension',
            keyConcept: 'Importance of personal visits for student support'
          },
          {
            id: 'm3p15-2',
            question: 'What should be done if there is not enough time to meet with every student before the start of the term?',
            expectedAnswer: 'If there is not enough time to meet with every student before the start of the term, you should continue to visit each student until all have had a personal visit.',
            type: 'application',
            keyConcept: 'Ongoing engagement with students'
          },
          {
            id: 'm3p15-3',
            question: 'What are some recommended methods for visiting students in virtual groups?',
            expectedAnswer: 'For virtual groups, it is recommended to use Zoom for visits, as this allows students to test their camera and microphone. If students have limited data connections, another popular communication tool in the area may be considered.',
            type: 'analysis',
            keyConcept: 'Methods of communication for virtual student visits'
          }
        ]
      }
    ]
  },

  // Module 4: Your First Gathering
  module4: {
    module: 'Module 4: Your First Gathering',
    moduleId: 4,
    title: 'Your First Gathering',
    pages: [
      // Page 16: Your Role in the First Gathering
      {
        pageId: 16,
        pageTitle: 'Your Role in the First Gathering',
        questions: [
          {
            id: 'm4p16-1',
            question: 'What is the primary role of the lead student during the first gathering?',
            expectedAnswer: 'The primary role of the lead student during the first gathering is to facilitate the discussion and set expectations for future lead students.',
            type: 'comprehension',
            keyConcept: 'The responsibilities of the lead student in the first gathering.'
          },
          {
            id: 'm4p16-2',
            question: 'How should the agenda for the first gathering be utilized by the lead student?',
            expectedAnswer: 'The lead student should use the agenda as a guide to structure the gathering, but it is not critical to cover all items; they should decide when to continue discussions or move on based on the Spirit.',
            type: 'application',
            keyConcept: 'Utilizing the gathering agenda effectively.'
          },
          {
            id: 'm4p16-3',
            question: 'What are some of the key benefits students gain from participating in weekly gatherings?',
            expectedAnswer: 'Students gain meaningful relationships, sharpen life skills, gain leadership skills, learn math, improve English abilities, deepen testimonies, and prepare for further education.',
            type: 'comprehension',
            keyConcept: 'The benefits of participation in the gathering experience.'
          }
        ]
      },
      // Page 17: Lead and Observing Students
      {
        pageId: 17,
        pageTitle: 'Lead and Observing Students',
        questions: [
          {
            id: 'm4p17-1',
            question: 'What is the process for selecting an observing student for Week 1?',
            expectedAnswer: 'The observing student for Week 1 is selected by the lead student, who is also the lead student for that week. The lead student should take note of new student visits to identify a good choice for the observing student.',
            type: 'comprehension',
            keyConcept: 'Selection process for lead and observing students'
          },
          {
            id: 'm4p17-2',
            question: 'How can students prepare for their roles as lead and observing students?',
            expectedAnswer: 'Students can prepare for their roles by reviewing the documents "Lead Student Preparation.pdf" and "Observing Student Preparation.pdf," which provide guidance and support for their responsibilities.',
            type: 'application',
            keyConcept: 'Preparation resources for lead and observing students'
          },
          {
            id: 'm4p17-3',
            question: 'What is a suggested strategy for selecting lead and observing students for the remaining weeks of the term?',
            expectedAnswer: 'A suggested strategy is to make a list of lead and observing students during the first gathering, ask for volunteers for the remaining weeks, and allow them to select a date and topic that works best for them. It may be helpful for students to sign up in pairs to lead.',
            type: 'analysis',
            keyConcept: 'Planning and organizing roles for future gatherings'
          }
        ]
      },
      // Page 18: Former PathwayConnect Completer
      {
        pageId: 18,
        pageTitle: 'Former PathwayConnect Completer',
        questions: [
          {
            id: 'm4p18-1',
            question: 'What is one suggested way to enhance the first gathering experience for students in PathwayConnect?',
            expectedAnswer: 'Inviting a PathwayConnect completer to share their experience is suggested to enhance the first gathering experience for students.',
            type: 'comprehension',
            keyConcept: 'The importance of sharing experiences to build confidence in students.'
          },
          {
            id: 'm4p18-2',
            question: 'What is the primary goal of the first gathering according to the lesson content?',
            expectedAnswer: 'The primary goal of the first gathering is for participants to walk away feeling connected to each other.',
            type: 'comprehension',
            keyConcept: 'The significance of connection among students in the initial gathering.'
          },
          {
            id: 'm4p18-3',
            question: 'How can a facilitator of the first gathering share their own experience effectively?',
            expectedAnswer: 'A facilitator who is a PathwayConnect completer can share their own experience to help encourage and connect with new students.',
            type: 'application',
            keyConcept: 'Utilizing personal experiences to foster encouragement and connection in a group setting.'
          }
        ]
      }
    ]
  },

  // Module 5: Learning More About the Student Information System
  module5: {
    module: 'Module 5: Learning More About the Student Information System',
    moduleId: 5,
    title: 'Student Information System',
    pages: [
      // Page 19: My Gatherings Portal and Student Information
      {
        pageId: 19,
        pageTitle: 'My Gatherings Portal and Student Information',
        questions: [
          {
            id: 'm5p19-1',
            question: 'What type of information is stored in the My Gatherings portal?',
            expectedAnswer: 'The My Gatherings portal stores student registration data, academic progress, and other information about students.',
            type: 'comprehension',
            keyConcept: 'Understanding the purpose and contents of the My Gatherings portal.'
          },
          {
            id: 'm5p19-2',
            question: 'How can educators use the My Gatherings portal to support students facing challenges?',
            expectedAnswer: 'Educators can identify warning signs such as academic struggles, lack of participation, financial issues, and delayed registration, and contact students immediately to offer help.',
            type: 'application',
            keyConcept: 'Utilizing the portal to proactively support students in need.'
          },
          {
            id: 'm5p19-3',
            question: 'What should educators do if they notice warning signs in the My Gatherings portal?',
            expectedAnswer: 'Educators should contact the students the moment they notice any warning signs to see if they can help.',
            type: 'analysis',
            keyConcept: 'Understanding the importance of timely intervention based on data from the portal.'
          }
        ]
      },
      // Page 20: Monitor Student Progress
      {
        pageId: 20,
        pageTitle: 'Monitor Student Progress',
        questions: [
          {
            id: 'm5p20-1',
            question: 'How can you filter the student list on the My Students page?',
            expectedAnswer: 'You can filter the student list by selecting one or multiple gatherings from the options at the top of the page and then clicking Apply Filter.',
            type: 'comprehension',
            keyConcept: 'Understanding how to navigate and utilize filtering options in the student information system.'
          },
          {
            id: 'm5p20-2',
            question: 'What information is displayed in the table on the My Students page?',
            expectedAnswer: 'The table contains essential information such as a student\'s last access date to the LMS and their current grade, which assists in ministering and caring for the students.',
            type: 'comprehension',
            keyConcept: 'Recognizing the type of data available on the My Students page.'
          },
          {
            id: 'm5p20-3',
            question: 'Describe the process to export a student list to an Excel file.',
            expectedAnswer: 'First, go to the My Students page and click the Export Student List link. Then, filter by group and click Apply Filter. Finally, click the Export List to Excel button to download the list to your computer.',
            type: 'application',
            keyConcept: 'Applying the steps to export student data for offline viewing.'
          }
        ]
      },
      // Page 21: Create Gathering Meeting Outlines
      {
        pageId: 21,
        pageTitle: 'Create Gathering Meeting Outlines',
        questions: [
          {
            id: 'm5p21-1',
            question: 'What steps must be followed to create a Gathering Meeting Outline for a course?',
            expectedAnswer: 'To create a Gathering Meeting Outline, click "Create a Gathering Outline," then use the magnifying glass to find and select your gathering name and course (PC 101, 102, 103 or EnglishConnect 3), add your Academic Period, choose the "All" option to generate all weekly outlines or select individual options, and finally click "Create."',
            type: 'application',
            keyConcept: 'Steps for creating gathering meeting outlines in the system.'
          },
          {
            id: 'm5p21-2',
            question: 'How many weeks of outlines need to be created for PathwayConnect and EnglishConnect 3 gatherings?',
            expectedAnswer: 'For PathwayConnect gatherings, outlines need to be created for weeks 1-7. For EnglishConnect 3 gatherings, outlines can be created for all 14 weeks.',
            type: 'comprehension',
            keyConcept: 'Understanding the number of weeks for which meeting outlines are required.'
          },
          {
            id: 'm5p21-3',
            question: 'What should be done after a meeting is completed in the My Gathering Meetings page?',
            expectedAnswer: 'After a meeting is completed, you should open the meeting record, check the "Completed" box, add any necessary notes, and then click "Save" to move the meeting into the Completed Gathering Meetings view.',
            type: 'application',
            keyConcept: 'Completing and saving meeting records in the system.'
          }
        ]
      }
    ]
  },

  // Module 6: Next Steps in Your Orientation Training
  module6: {
    module: 'Module 6: Next Steps in Your Orientation Training',
    moduleId: 6,
    title: 'Next Steps in Training',
    pages: [
      // Page 22: Missionary Training and Resources
      {
        pageId: 22,
        pageTitle: 'Missionary Training and Resources',
        questions: [
          {
            id: 'm6p22-1',
            question: 'What should you ensure about your church user password before logging into the Missionary Services website?',
            expectedAnswer: 'You should ensure that your church user password is 12 or more characters to avoid your access being locked.',
            type: 'comprehension',
            keyConcept: 'Importance of password security for accessing the Missionary Services website.'
          },
          {
            id: 'm6p22-2',
            question: 'How can you return to the homepage of the Missionary Services website from any page?',
            expectedAnswer: 'You can return to the homepage by clicking on the "Missionary Services Hub" or by clicking the site title "BYU-Pathway Missionary Services" or logo.',
            type: 'application',
            keyConcept: 'Navigation methods within the Missionary Services website.'
          },
          {
            id: 'm6p22-3',
            question: 'What type of resources can be accessed through the Gathering Resources menu?',
            expectedAnswer: 'The Gathering Resources menu contains weekly guides to find gathering agendas, course previews, devotionals, and other helpful resources.',
            type: 'comprehension',
            keyConcept: 'Understanding the types of resources available for missionaries on the website.'
          }
        ]
      },
      // Page 23: Your Orientation Trainer and Additional Training Resources
      {
        pageId: 23,
        pageTitle: 'Your Orientation Trainer and Additional Training Resources',
        questions: [
          {
            id: 'm6p23-1',
            question: 'What will happen after you have met with your orientation trainer and have had your questions answered?',
            expectedAnswer: 'You will be connected with your area zone or district leaders once your orientation trainer feels you are ready to move on.',
            type: 'comprehension',
            keyConcept: 'Connection to leadership after orientation'
          },
          {
            id: 'm6p23-2',
            question: 'What type of ongoing support can you expect from your zone or district leader during your service?',
            expectedAnswer: 'Your zone or district leader will provide support and guidance throughout the rest of your service, and you will have regular zone or district meetings.',
            type: 'comprehension',
            keyConcept: 'Support structure during service'
          },
          {
            id: 'm6p23-3',
            question: 'Where can you find the ongoing training materials each week?',
            expectedAnswer: 'You can find ongoing training materials on the Missionary Services website or in the weekly Missionary Update email.',
            type: 'application',
            keyConcept: 'Accessing training resources for continuous improvement'
          }
        ]
      }
    ]
  }
};

// Helper function to get all questions for a module
export function getModuleQuestions(moduleId) {
  const moduleKey = moduleId === 0 ? 'intro' : `module${moduleId}`;
  const moduleData = QUESTIONS[moduleKey];
  
  if (!moduleData) return [];
  
  if (moduleData.questions) {
    // Introduction has direct questions
    return moduleData.questions.map(q => ({ ...q, moduleId }));
  }
  
  // Other modules have pages with questions
  return moduleData.pages.flatMap(page => 
    page.questions.map(q => ({ ...q, moduleId, pageId: page.pageId }))
  );
}

// Helper function to get random questions from a module
export function getRandomQuestionsFromModule(moduleId, count) {
  const questions = getModuleQuestions(moduleId);
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get all questions
export function getAllQuestions() {
  const allQuestions = [];
  
  // Add intro questions
  allQuestions.push(...getModuleQuestions(0));
  
  // Add questions from all modules
  for (let i = 1; i <= 6; i++) {
    allQuestions.push(...getModuleQuestions(i));
  }
  
  return allQuestions;
}

// Get total question count
export function getTotalQuestionCount() {
  return getAllQuestions().length;
}

// Get module metadata
export function getModuleMetadata(moduleId) {
  const moduleKey = moduleId === 0 ? 'intro' : `module${moduleId}`;
  const moduleData = QUESTIONS[moduleKey];
  
  if (!moduleData) return null;
  
  return {
    moduleId,
    title: moduleData.title,
    module: moduleData.module,
    questionCount: getModuleQuestions(moduleId).length
  };
}
