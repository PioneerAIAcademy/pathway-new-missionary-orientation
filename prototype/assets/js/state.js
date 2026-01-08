import { CONFIG } from './config.js';
import { generateUUID } from './utils.js';

// Global state management
class AssessmentState {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = [];
    this.loadFromStorage();
  }
  
  getInitialState() {
    return {
      missionary: {
        id: generateUUID(),
        name: '',
        createdAt: new Date().toISOString()
      },
      assessment: {
        mode: null, // 'full', 'topic', 'quick'
        selectedModules: [],
        currentModule: null,
        currentQuestion: null,
        startedAt: null,
        completedAt: null
      },
      progress: {
        answers: [],
        moduleProgress: {},
        overallProgress: 0
      },
      results: {
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        moduleScores: {},
        recommendations: [],
        completedAt: null
      }
    };
  }
  
  // Get current state
  get() {
    return this.state;
  }
  
  // Update state
  update(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveToStorage();
  }
  
  // Update nested state
  updateNested(path, value) {
    const keys = path.split('.');
    const newState = { ...this.state };
    let current = newState;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    this.state = newState;
    this.notifyListeners();
    this.saveToStorage();
  }
  
  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(
        CONFIG.storageKeys.assessment,
        JSON.stringify(this.state)
      );
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
  
  // Load from localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKeys.assessment);
      if (saved) {
        this.state = { ...this.getInitialState(), ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
  
  // Reset state
  reset() {
    this.state = this.getInitialState();
    this.notifyListeners();
    this.saveToStorage();
  }
  
  // Set missionary name
  setMissionaryName(name) {
    this.updateNested('missionary.name', name);
  }
  
  // Set assessment mode
  setAssessmentMode(mode) {
    this.updateNested('assessment.mode', mode);
    this.updateNested('assessment.startedAt', new Date().toISOString());
  }
  
  // Set selected modules
  setSelectedModules(modules) {
    this.updateNested('assessment.selectedModules', modules);
  }
  
  // Set current question
  setCurrentQuestion(moduleId, questionId) {
    this.updateNested('assessment.currentModule', moduleId);
    this.updateNested('assessment.currentQuestion', questionId);
  }
  
  // Add answer
  addAnswer(answer) {
    const answers = [...this.state.progress.answers, answer];
    this.updateNested('progress.answers', answers);
    
    // Update module progress
    const moduleId = answer.moduleId;
    const moduleAnswers = answers.filter(a => a.moduleId === moduleId);
    const correctInModule = moduleAnswers.filter(a => a.isCorrect).length;
    
    const moduleProgress = {
      ...this.state.progress.moduleProgress,
      [moduleId]: {
        total: moduleAnswers.length,
        correct: correctInModule,
        percentage: Math.round((correctInModule / moduleAnswers.length) * 100)
      }
    };
    
    this.updateNested('progress.moduleProgress', moduleProgress);
    
    // Update overall progress
    const totalCorrect = answers.filter(a => a.isCorrect).length;
    const overallProgress = Math.round((totalCorrect / answers.length) * 100);
    this.updateNested('progress.overallProgress', overallProgress);
  }
  
  // Calculate final results
  calculateResults() {
    const answers = this.state.progress.answers;
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Calculate module scores
    const moduleScores = {};
    const moduleGroups = answers.reduce((acc, answer) => {
      if (!acc[answer.moduleId]) {
        acc[answer.moduleId] = [];
      }
      acc[answer.moduleId].push(answer);
      return acc;
    }, {});
    
    Object.entries(moduleGroups).forEach(([moduleId, moduleAnswers]) => {
      const correct = moduleAnswers.filter(a => a.isCorrect).length;
      moduleScores[moduleId] = {
        total: moduleAnswers.length,
        correct,
        percentage: Math.round((correct / moduleAnswers.length) * 100)
      };
    });
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(moduleScores);
    
    const results = {
      score,
      totalQuestions,
      correctAnswers,
      moduleScores,
      recommendations,
      completedAt: new Date().toISOString()
    };
    
    this.updateNested('results', results);
    this.updateNested('assessment.completedAt', new Date().toISOString());
    
    return results;
  }
  
  // Generate recommendations based on performance
  generateRecommendations(moduleScores) {
    const recommendations = [];
    
    Object.entries(moduleScores).forEach(([moduleId, score]) => {
      if (score.percentage < 70) {
        recommendations.push({
          moduleId: parseInt(moduleId),
          moduleName: this.getModuleName(parseInt(moduleId)),
          reason: `You scored ${score.percentage}% in this module`,
          priority: score.percentage < 50 ? 'high' : 'medium',
          trainingUrl: CONFIG.trainingUrls.modules[moduleId]
        });
      }
    });
    
    // Sort by priority and score
    recommendations.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      
      const aScore = moduleScores[a.moduleId].percentage;
      const bScore = moduleScores[b.moduleId].percentage;
      return aScore - bScore;
    });
    
    return recommendations;
  }
  
  // Get module name helper
  getModuleName(moduleId) {
    const names = {
      1: 'Access to Essential Systems',
      2: 'Zoom for Virtual Gatherings',
      3: 'Contacting Your Students',
      4: 'Your First Gathering',
      5: 'Student Information System',
      6: 'Next Steps in Training'
    };
    return names[moduleId] || `Module ${moduleId}`;
  }
  
  // Check if assessment should end early (90% accuracy)
  shouldEndEarly() {
    const progress = this.state.progress;
    const answers = progress.answers;
    
    if (answers.length < 10) return false; // Need minimum questions
    
    const correctCount = answers.filter(a => a.isCorrect).length;
    const accuracy = correctCount / answers.length;
    
    return accuracy >= CONFIG.assessment.adaptiveThreshold.earlyCompletion;
  }
  
  // Check if should skip module (3 correct in a row)
  shouldSkipModule(moduleId) {
    const answers = this.state.progress.answers;
    const moduleAnswers = answers.filter(a => a.moduleId === moduleId);
    
    if (moduleAnswers.length < 3) return false;
    
    const lastThree = moduleAnswers.slice(-3);
    return lastThree.every(a => a.isCorrect);
  }
}

// Export singleton instance
export const state = new AssessmentState();
