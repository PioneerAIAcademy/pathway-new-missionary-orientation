// Configuration
export const CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || 'BYU-Pathway Assessment',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // Set in .env file
    endpoint: import.meta.env.VITE_OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini' // Cost-effective for validation
  },
  
  // Storage keys
  storageKeys: {
    assessment: 'byu-pathway-assessment',
    missionary: 'byu-pathway-missionary',
    progress: 'byu-pathway-progress'
  },
  
  // Assessment settings
  assessment: {
    adaptiveThreshold: {
      skipModule: 3,            // Skip after 3 consecutive correct
      earlyCompletion: 0.90,    // 90% overall accuracy
      struggleThreshold: 3      // Mark for review after 3 wrong
    },
    validationThreshold: {
      correct: 0.70,             // 70%+ confidence = correct
      partial: 0.50              // 50-69% = partial credit
    }
  },
  
  // Training URLs (from Articulate Rise 360)
  trainingUrls: {
    base: 'https://rise.articulate.com/share/',
    // These would be real URLs in production
    modules: {
      1: '#module-1-essential-systems',
      2: '#module-2-zoom-gatherings',
      3: '#module-3-contacting-students',
      4: '#module-4-first-gathering',
      5: '#module-5-student-info-system',
      6: '#module-6-next-steps'
    }
  }
};
