import { state } from './state.js';
import { router } from './router.js';
import { WelcomeScreen } from './screens/welcome.js';
import { ModeSelectionScreen } from './screens/mode-selection.js';
import { ModuleSelectionScreen } from './screens/module-selection.js';
import { AssessmentScreen } from './screens/assessment.js';
import { ResultsScreen } from './screens/results.js';

// Initialize app
class App {
  constructor() {
    this.init();
  }
  
  async init() {
    // Register all screens
    router.register('welcome', new WelcomeScreen());
    router.register('mode-selection', new ModeSelectionScreen());
    router.register('module-selection', new ModuleSelectionScreen());
    router.register('assessment', new AssessmentScreen());
    router.register('results', new ResultsScreen());
    
    // Check if user has existing state
    const currentState = state.get();
    
    if (currentState.missionary.name && !currentState.assessment.completedAt) {
      // Returning user with incomplete assessment
      const resume = confirm(
        `Welcome back, ${currentState.missionary.name}! Would you like to continue your assessment?`
      );
      
      if (resume) {
        // Resume from where they left off
        if (currentState.assessment.mode) {
          router.navigate('assessment', { mode: currentState.assessment.mode });
        } else if (currentState.assessment.selectedModules.length > 0) {
          router.navigate('assessment', { mode: 'topic' });
        } else {
          router.navigate('mode-selection');
        }
      } else {
        // Start fresh
        state.reset();
        router.navigate('welcome');
      }
    } else if (currentState.results.completedAt) {
      // User has completed assessment
      const viewResults = confirm(
        `Welcome back, ${currentState.missionary.name}! Would you like to view your previous results?`
      );
      
      if (viewResults) {
        router.navigate('results');
      } else {
        state.reset();
        router.navigate('welcome');
      }
    } else {
      // New user
      router.navigate('welcome');
    }
    
    // Add reset functionality to header
    this.addHeaderActions();
    
    // Subscribe to state changes for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      state.subscribe((newState) => {
        console.log('State updated:', newState);
      });
    }
  }
  
  addHeaderActions() {
    const header = document.querySelector('.app-header');
    
    // Create reset button
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn-ghost reset-btn';
    resetBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
      Reset
    `;
    
    resetBtn.addEventListener('click', () => {
      const confirm = window.confirm(
        'Are you sure you want to reset? This will clear all your progress and start over.'
      );
      
      if (confirm) {
        state.reset();
        router.reset('welcome');
        
        // Show toast
        const toast = document.createElement('div');
        toast.className = 'toast toast-info animate-slideUp';
        toast.textContent = 'Assessment reset. Starting over...';
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.animation = 'fadeOut 0.3s ease';
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      }
    });
    
    const actions = header.querySelector('.header-actions');
    actions.appendChild(resetBtn);
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}
