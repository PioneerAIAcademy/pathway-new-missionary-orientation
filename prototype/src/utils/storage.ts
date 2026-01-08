export interface QuestionResponse {
  questionId: string;
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  confidence: number;
  feedback: string;
  timestamp: string;
  moduleId: number;
  topicId: number;
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  questionsAnswered: number;
  totalQuestions: number;
  percentComplete: number;
  currentModuleId: number;
  currentTopicId: number;
}

export interface ModuleScore {
  moduleId: number;
  moduleName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface AssessmentResults {
  overallScore: number;
  moduleScores: ModuleScore[];
  masteredTopics: number[];
  needsReviewTopics: number[];
  totalQuestionsAsked: number;
  totalQuestionsAnswered: number;
  generatedAt: string;
}

export interface AssessmentState {
  missionaryId: string;
  name: string | null;
  startTime: string;
  lastActive: string;
  mode: 'full-assessment' | 'topic-selection' | 'quick-check' | null;
  selectedModules: number[];
  progress: AssessmentProgress;
  responses: QuestionResponse[];
  results: AssessmentResults | null;
  completedModules: number[];
  skippedQuestions: string[];
}

const STORAGE_KEY = 'byu-pathway-assessment';

export const getInitialState = (): AssessmentState => ({
  missionaryId: `missionary-${Date.now()}`,
  name: null,
  startTime: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  mode: null,
  selectedModules: [],
  progress: {
    currentQuestionIndex: 0,
    questionsAnswered: 0,
    totalQuestions: 0,
    percentComplete: 0,
    currentModuleId: 1,
    currentTopicId: 1
  },
  responses: [],
  results: null,
  completedModules: [],
  skippedQuestions: []
});

export const loadState = (): AssessmentState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

export const saveState = (state: AssessmentState): void => {
  try {
    const updatedState = {
      ...state,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const resetState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting state:', error);
  }
};

export const updateProgress = (state: AssessmentState, totalQuestions: number): AssessmentState => {
  const questionsAnswered = state.responses.filter(r => !state.skippedQuestions.includes(r.questionId)).length;
  const percentComplete = Math.round((questionsAnswered / totalQuestions) * 100);
  
  return {
    ...state,
    progress: {
      ...state.progress,
      questionsAnswered,
      totalQuestions,
      percentComplete
    }
  };
};

export const calculateResults = (state: AssessmentState, modules: any[]): AssessmentResults => {
  const moduleScores: ModuleScore[] = [];
  const masteredTopics: number[] = [];
  const needsReviewTopics: number[] = [];
  
  // Calculate scores per module
  modules.forEach(module => {
    const moduleResponses = state.responses.filter(r => r.moduleId === module.id);
    const correctAnswers = moduleResponses.filter(r => r.isCorrect).length;
    const totalQuestions = moduleResponses.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    moduleScores.push({
      moduleId: module.id,
      moduleName: module.name,
      score,
      totalQuestions,
      correctAnswers
    });
    
    // Determine mastered vs needs review topics
    module.topics.forEach((topic: any) => {
      const topicResponses = state.responses.filter(r => r.topicId === topic.id);
      const topicCorrect = topicResponses.filter(r => r.isCorrect).length;
      const topicTotal = topicResponses.length;
      const topicScore = topicTotal > 0 ? (topicCorrect / topicTotal) * 100 : 0;
      
      if (topicScore >= 80 && topicTotal > 0) {
        masteredTopics.push(topic.id);
      } else if (topicTotal > 0) {
        needsReviewTopics.push(topic.id);
      }
    });
  });
  
  // Calculate overall score
  const totalCorrect = state.responses.filter(r => r.isCorrect).length;
  const totalAnswered = state.responses.length;
  const overallScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  
  return {
    overallScore,
    moduleScores,
    masteredTopics,
    needsReviewTopics,
    totalQuestionsAsked: totalAnswered,
    totalQuestionsAnswered: totalAnswered,
    generatedAt: new Date().toISOString()
  };
};
