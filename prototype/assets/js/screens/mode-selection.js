import { state } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../utils.js';
import { getTotalQuestionCount } from '../data/questions.js';

// Mode Selection Screen Component
export class ModeSelectionScreen {
  constructor() {
    this.container = null;
  }
  
  async show(data = {}) {
    this.render();
    this.attachEventListeners();
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
    const missionaryName = state.get().missionary.name;
    const totalQuestions = getTotalQuestionCount();
    
    this.container = document.createElement('div');
    this.container.className = 'screen mode-selection-screen animate-fadeIn';
    this.container.innerHTML = `
      <div class="mode-selection-content">
        <div class="mode-header">
          <h1 class="mode-title">Choose Your Assessment Path, ${missionaryName}</h1>
          <p class="mode-description">
            Select the assessment format that works best for you. You can always retake the assessment later.
          </p>
        </div>
        
        <div class="mode-grid">
          <!-- Full Assessment -->
          <div class="mode-card card-interactive" data-mode="full">
            <div class="mode-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="mode-name">Full Assessment</h3>
            <p class="mode-desc">Complete assessment covering all 6 modules</p>
            <div class="mode-stats">
              <div class="mode-stat">
                <span class="mode-stat-value">${totalQuestions}</span>
                <span class="mode-stat-label">Questions</span>
              </div>
              <div class="mode-stat">
                <span class="mode-stat-value">~25</span>
                <span class="mode-stat-label">Minutes</span>
              </div>
            </div>
            <div class="mode-badge badge-info">Recommended</div>
          </div>
          
          <!-- Topic Selection -->
          <div class="mode-card card-interactive" data-mode="topic">
            <div class="mode-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h3 class="mode-name">Topic Selection</h3>
            <p class="mode-desc">Choose specific modules to focus on</p>
            <div class="mode-stats">
              <div class="mode-stat">
                <span class="mode-stat-value">Custom</span>
                <span class="mode-stat-label">Questions</span>
              </div>
              <div class="mode-stat">
                <span class="mode-stat-value">~15</span>
                <span class="mode-stat-label">Minutes</span>
              </div>
            </div>
            <div class="mode-badge badge-warning">Flexible</div>
          </div>
          
          <!-- Quick Check -->
          <div class="mode-card card-interactive" data-mode="quick">
            <div class="mode-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="mode-name">Quick Check</h3>
            <p class="mode-desc">Brief assessment of core concepts</p>
            <div class="mode-stats">
              <div class="mode-stat">
                <span class="mode-stat-value">12</span>
                <span class="mode-stat-label">Questions</span>
              </div>
              <div class="mode-stat">
                <span class="mode-stat-value">~8</span>
                <span class="mode-stat-label">Minutes</span>
              </div>
            </div>
            <div class="mode-badge badge-success">Fast</div>
          </div>
        </div>
      </div>
    `;
    
    appContainer.appendChild(this.container);
  }
  
  attachEventListeners() {
    const modeCards = this.container.querySelectorAll('.mode-card');
    
    modeCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.selectMode(mode);
      });
      
      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const mode = card.dataset.mode;
          this.selectMode(mode);
        }
      });
    });
  }
  
  selectMode(mode) {
    // Save mode to state
    state.setAssessmentMode(mode);
    
    showToast(`${mode === 'full' ? 'Full Assessment' : mode === 'topic' ? 'Topic Selection' : 'Quick Check'} selected`, 'success');
    
    // Navigate based on mode
    if (mode === 'topic') {
      router.navigate('module-selection');
    } else {
      // For full and quick, go straight to assessment
      router.navigate('assessment', { mode });
    }
  }
}
