import { state } from '../state.js';
import { router } from '../router.js';
import { showToast, formatDate } from '../utils.js';
import { getModuleMetadata } from '../data/questions.js';

// Results Screen Component
export class ResultsScreen {
  constructor() {
    this.container = null;
  }
  
  async show(data = {}) {
    this.render();
    this.attachEventListeners();
    this.animateScore();
  }
  
  async hide() {
    if (this.container) {
      this.container.style.animation = 'fadeOut 0.3s ease';
      await new Promise(resolve => setTimeout(resolve, 300));
      this.container.remove();
    }
  }
  
  render() {
    const appContainer = document.querySelector('.app-container');
    const currentState = state.get();
    const results = currentState.results;
    const missionaryName = currentState.missionary.name;
    
    // Determine performance level
    let performanceLevel = '';
    let performanceMessage = '';
    let performanceClass = '';
    
    if (results.score >= 90) {
      performanceLevel = 'Excellent';
      performanceMessage = 'You have demonstrated excellent understanding of the material!';
      performanceClass = 'performance-excellent';
    } else if (results.score >= 75) {
      performanceLevel = 'Good';
      performanceMessage = 'You have a good grasp of the material with some areas to review.';
      performanceClass = 'performance-good';
    } else if (results.score >= 60) {
      performanceLevel = 'Fair';
      performanceMessage = 'You understand the basics but would benefit from additional study.';
      performanceClass = 'performance-fair';
    } else {
      performanceLevel = 'Needs Improvement';
      performanceMessage = 'We recommend reviewing the training materials before continuing.';
      performanceClass = 'performance-needs-improvement';
    }
    
    this.container = document.createElement('div');
    this.container.className = 'screen results-screen animate-fadeIn';
    this.container.innerHTML = `
      <div class="results-container">
        <div class="results-header">
          <h1 class="results-title">Assessment Complete, ${missionaryName}!</h1>
          <p class="results-subtitle">Here's how you performed</p>
        </div>
        
        <div class="results-score-section ${performanceClass}">
          <div class="score-circle">
            <svg class="score-ring" viewBox="0 0 120 120">
              <circle class="score-ring-bg" cx="60" cy="60" r="54" />
              <circle 
                class="score-ring-progress" 
                cx="60" 
                cy="60" 
                r="54" 
                stroke-dasharray="339.292"
                stroke-dashoffset="339.292"
                id="score-ring-progress"
              />
            </svg>
            <div class="score-content">
              <div class="score-value" id="score-value">0</div>
              <div class="score-label">Score</div>
            </div>
          </div>
          
          <div class="performance-info">
            <h2 class="performance-level">${performanceLevel}</h2>
            <p class="performance-message">${performanceMessage}</p>
          </div>
        </div>
        
        <div class="results-summary">
          <h3 class="summary-title">Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <div class="summary-content">
                <div class="summary-value">${results.correctAnswers}</div>
                <div class="summary-label">Correct Answers</div>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="summary-content">
                <div class="summary-value">${results.totalQuestions}</div>
                <div class="summary-label">Total Questions</div>
              </div>
            </div>
            
            <div class="summary-item">
              <div class="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
              </div>
              <div class="summary-content">
                <div class="summary-value">${results.totalQuestions - results.correctAnswers}</div>
                <div class="summary-label">Needs Review</div>
              </div>
            </div>
          </div>
        </div>
        
        ${this.renderModuleBreakdown(results)}
        
        ${results.recommendations.length > 0 ? this.renderRecommendations(results.recommendations) : ''}
        
        <div class="results-actions">
          <button class="btn-primary" id="retake-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Retake Assessment
          </button>
          <button class="btn-secondary" id="new-assessment-btn">
            Start New Assessment
          </button>
        </div>
        
        <div class="results-footer">
          <p class="results-date">Completed on ${formatDate(results.completedAt)}</p>
        </div>
      </div>
    `;
    
    appContainer.appendChild(this.container);
  }
  
  renderModuleBreakdown(results) {
    const moduleScores = results.moduleScores;
    
    if (Object.keys(moduleScores).length === 0) {
      return '';
    }
    
    const moduleEntries = Object.entries(moduleScores).map(([moduleId, score]) => {
      const metadata = getModuleMetadata(parseInt(moduleId));
      const percentage = score.percentage;
      
      let statusClass = '';
      if (percentage >= 80) statusClass = 'module-excellent';
      else if (percentage >= 65) statusClass = 'module-good';
      else if (percentage >= 50) statusClass = 'module-fair';
      else statusClass = 'module-needs-review';
      
      return `
        <div class="module-score-item ${statusClass}">
          <div class="module-score-header">
            <h4 class="module-score-title">${metadata.title}</h4>
            <span class="module-score-percentage">${percentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="module-score-details">
            <span>${score.correct} of ${score.total} correct</span>
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="results-modules">
        <h3 class="modules-title">Module Breakdown</h3>
        <div class="module-scores">
          ${moduleEntries}
        </div>
      </div>
    `;
  }
  
  renderRecommendations(recommendations) {
    const recommendationItems = recommendations.map(rec => {
      const priorityClass = rec.priority === 'high' ? 'badge-error' : 'badge-warning';
      
      return `
        <div class="recommendation-item card">
          <div class="recommendation-header">
            <h4 class="recommendation-title">${rec.moduleName}</h4>
            <span class="badge ${priorityClass}">${rec.priority === 'high' ? 'High Priority' : 'Review'}</span>
          </div>
          <p class="recommendation-reason">${rec.reason}</p>
          <a href="${rec.trainingUrl}" class="recommendation-link" target="_blank" rel="noopener">
            View Training Material
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      `;
    }).join('');
    
    return `
      <div class="results-recommendations">
        <h3 class="recommendations-title">Recommended Training</h3>
        <p class="recommendations-subtitle">Based on your performance, we recommend reviewing these modules:</p>
        <div class="recommendations-grid">
          ${recommendationItems}
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    const retakeBtn = document.getElementById('retake-btn');
    const newAssessmentBtn = document.getElementById('new-assessment-btn');
    
    retakeBtn.addEventListener('click', () => {
      this.retakeAssessment();
    });
    
    newAssessmentBtn.addEventListener('click', () => {
      this.startNewAssessment();
    });
  }
  
  animateScore() {
    const results = state.get().results;
    const targetScore = results.score;
    const scoreValue = document.getElementById('score-value');
    const scoreRing = document.getElementById('score-ring-progress');
    
    const circumference = 339.292;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentScore = Math.round(targetScore * eased);
      const offset = circumference - (circumference * currentScore / 100);
      
      scoreValue.textContent = `${currentScore}%`;
      scoreRing.style.strokeDashoffset = offset;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    // Start animation after a short delay
    setTimeout(() => animate(), 500);
  }
  
  retakeAssessment() {
    showToast('Retaking assessment with same settings', 'info');
    
    // Keep the same mode and modules, but reset answers
    const currentState = state.get();
    const mode = currentState.assessment.mode;
    const selectedModules = currentState.assessment.selectedModules;
    
    // Reset progress and results
    state.update({
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
    });
    
    // Restart assessment
    router.navigate('assessment', { mode });
  }
  
  startNewAssessment() {
    showToast('Starting new assessment', 'info');
    
    // Reset state completely
    state.reset();
    
    // Keep the missionary name
    const currentName = state.get().missionary.name;
    state.setMissionaryName(currentName);
    
    // Go back to mode selection
    router.navigate('mode-selection');
  }
}
