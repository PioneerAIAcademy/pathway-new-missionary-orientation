import { state } from '../state.js';
import { router } from '../router.js';
import { showToast } from '../utils.js';
import { getModuleMetadata } from '../data/questions.js';

// Module Selection Screen Component
export class ModuleSelectionScreen {
  constructor() {
    this.container = null;
    this.selectedModules = [];
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
    
    const modules = [
      getModuleMetadata(1),
      getModuleMetadata(2),
      getModuleMetadata(3),
      getModuleMetadata(4),
      getModuleMetadata(5),
      getModuleMetadata(6)
    ];
    
    this.container = document.createElement('div');
    this.container.className = 'screen module-selection-screen animate-fadeIn';
    this.container.innerHTML = `
      <div class="module-selection-content">
        <div class="module-header">
          <button class="btn-ghost" id="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <h1 class="module-title">Select Topics to Assess</h1>
          <p class="module-description">
            Choose one or more modules you'd like to be assessed on. We recommend selecting areas you want to focus on.
          </p>
        </div>
        
        <div class="module-grid">
          ${modules.map(module => `
            <label class="module-checkbox-card card-interactive" data-module-id="${module.moduleId}">
              <input type="checkbox" name="module" value="${module.moduleId}" />
              <div class="module-checkbox-content">
                <div class="module-checkbox-header">
                  <div class="module-checkbox-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h3 class="module-checkbox-title">${module.title}</h3>
                </div>
                <p class="module-checkbox-subtitle">${module.module}</p>
                <div class="module-checkbox-meta">
                  <span class="module-question-count">${module.questionCount} questions</span>
                </div>
              </div>
            </label>
          `).join('')}
        </div>
        
        <div class="module-actions">
          <button class="btn-primary" id="start-assessment-btn" disabled>
            Start Assessment
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    appContainer.appendChild(this.container);
  }
  
  attachEventListeners() {
    const backBtn = document.getElementById('back-btn');
    const startBtn = document.getElementById('start-assessment-btn');
    const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
    
    // Back button
    backBtn.addEventListener('click', () => {
      router.back();
    });
    
    // Checkbox selection
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateSelection();
      });
    });
    
    // Start button
    startBtn.addEventListener('click', () => {
      this.startAssessment();
    });
  }
  
  updateSelection() {
    const checkboxes = this.container.querySelectorAll('input[type="checkbox"]:checked');
    this.selectedModules = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    const startBtn = document.getElementById('start-assessment-btn');
    startBtn.disabled = this.selectedModules.length === 0;
    
    // Update visual state of cards
    const cards = this.container.querySelectorAll('.module-checkbox-card');
    cards.forEach(card => {
      const moduleId = parseInt(card.dataset.moduleId);
      if (this.selectedModules.includes(moduleId)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }
  
  startAssessment() {
    if (this.selectedModules.length === 0) {
      showToast('Please select at least one module', 'warning');
      return;
    }
    
    // Save selected modules to state
    state.setSelectedModules(this.selectedModules);
    
    showToast(`${this.selectedModules.length} module${this.selectedModules.length > 1 ? 's' : ''} selected`, 'success');
    
    // Navigate to assessment
    router.navigate('assessment', { mode: 'topic' });
  }
}
