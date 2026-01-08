import { state } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../utils.js';

// Welcome Screen Component
export class WelcomeScreen {
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
    
    this.container = document.createElement('div');
    this.container.className = 'screen welcome-screen animate-fadeIn';
    this.container.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-icon animate-scaleIn">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        
        <h1 class="welcome-title">Welcome to Your Orientation Assessment</h1>
        <p class="welcome-description">
          This assessment will help us understand your readiness to serve as a BYU-Pathway missionary. 
          Your responses will guide us in providing you with the most relevant training and support.
        </p>
        
        <form class="welcome-form" id="welcome-form">
          <div class="form-group">
            <label for="missionary-name">What is your name?</label>
            <input 
              type="text" 
              id="missionary-name" 
              class="input" 
              placeholder="Enter your full name"
              value="${state.get().missionary.name || ''}"
              required
              autocomplete="name"
            />
          </div>
          
          <button type="submit" class="btn-primary">
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </form>
        
        <div class="welcome-footer">
          <p>This assessment typically takes 15-30 minutes to complete</p>
        </div>
      </div>
    `;
    
    appContainer.appendChild(this.container);
  }
  
  attachEventListeners() {
    const form = document.getElementById('welcome-form');
    const input = document.getElementById('missionary-name');
    
    // Focus input after animation
    setTimeout(() => input.focus(), 300);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = input.value.trim();
      
      if (!name) {
        showToast('Please enter your name', 'warning');
        input.focus();
        return;
      }
      
      // Save name to state
      state.setMissionaryName(name);
      
      showToast(`Welcome, ${name}!`, 'success');
      
      // Navigate to mode selection
      router.navigate('mode-selection');
    });
  }
}
