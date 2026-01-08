import { state } from '../state.js';
import { router } from '../router.js';
import { api } from '../api.js';
import { showToast, sleep, sanitizeHTML } from '../utils.js';
import { getModuleQuestions, getRandomQuestionsFromModule, getAllQuestions } from '../data/questions.js';

// Assessment Screen Component
export class AssessmentScreen {
  constructor() {
    this.container = null;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.isProcessing = false;
  }
  
  async show(data = {}) {
    this.loadQuestions(data.mode);
    this.render();
    this.attachEventListeners();
    this.showNextQuestion();
  }
  
  async hide() {
    if (this.container) {
      this.container.style.animation = 'fadeOut 0.3s ease';
      await new Promise(resolve => setTimeout(resolve, 300));
      this.container.remove();
    }
  }
  
  loadQuestions(mode) {
    const currentState = state.get();
    
    if (mode === 'full') {
      // All questions from all modules
      this.questions = getAllQuestions();
    } else if (mode === 'topic') {
      // Questions from selected modules
      const selectedModules = currentState.assessment.selectedModules;
      this.questions = selectedModules.flatMap(moduleId => getModuleQuestions(moduleId));
    } else if (mode === 'quick') {
      // 2 random questions from each module
      this.questions = [];
      for (let i = 1; i <= 6; i++) {
        this.questions.push(...getRandomQuestionsFromModule(i, 2));
      }
    }
  }
  
  render() {
    const appContainer = document.querySelector('.app-container');
    const currentState = state.get();
    
    this.container = document.createElement('div');
    this.container.className = 'screen assessment-screen animate-fadeIn';
    this.container.innerHTML = `
      <div class="assessment-container">
        <div class="assessment-header">
          <div class="assessment-progress">
            <div class="progress-bar">
              <div class="progress-bar-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">
              <span id="progress-text">Question 0 of ${this.questions.length}</span>
              <span id="progress-percentage">0%</span>
            </div>
          </div>
        </div>
        
        <div class="assessment-content">
          <div class="messages-container" id="messages-container">
            <div class="message-ai animate-slideUp">
              <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
              </div>
              <div class="message-content">
                <p>Hi ${sanitizeHTML(currentState.missionary.name)}! Let's begin your assessment. I'll ask you questions, and you can answer in your own words. Take your time and answer as completely as you can.</p>
              </div>
            </div>
          </div>
          
          <div class="input-wrapper">
            <textarea 
              id="answer-input" 
              class="input input-textarea" 
              placeholder="Type your answer here..."
              rows="3"
              disabled
            ></textarea>
            <button class="btn-primary" id="submit-btn" disabled>
              Submit
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    appContainer.appendChild(this.container);
  }
  
  attachEventListeners() {
    const input = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    
    input.addEventListener('input', () => {
      submitBtn.disabled = !input.value.trim() || this.isProcessing;
    });
    
    submitBtn.addEventListener('click', () => {
      this.submitAnswer();
    });
    
    // Submit on Enter (with Shift+Enter for new line)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !this.isProcessing) {
        e.preventDefault();
        if (input.value.trim()) {
          this.submitAnswer();
        }
      }
    });
  }
  
  async showNextQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      // Assessment complete
      this.completeAssessment();
      return;
    }
    
    const question = this.questions[this.currentQuestionIndex];
    
    // Check if should skip module (3 correct in a row for this module)
    const currentState = state.get();
    if (currentState.progress.moduleProgress[question.moduleId]) {
      if (state.shouldSkipModule(question.moduleId)) {
        showToast(`Great work! Skipping remaining questions in this module.`, 'success');
        // Skip to next module's questions
        this.currentQuestionIndex = this.questions.findIndex(
          (q, i) => i > this.currentQuestionIndex && q.moduleId !== question.moduleId
        );
        if (this.currentQuestionIndex === -1) {
          this.completeAssessment();
          return;
        }
        this.showNextQuestion();
        return;
      }
    }
    
    // Check if should end early (90% accuracy)
    if (state.shouldEndEarly()) {
      showToast('Excellent performance! Completing assessment early.', 'success');
      this.completeAssessment();
      return;
    }
    
    // Update progress
    this.updateProgress();
    
    // Show typing indicator
    await this.showTypingIndicator();
    
    // Add question message
    await sleep(500);
    this.addAIMessage(question.question);
    
    // Enable input
    const input = document.getElementById('answer-input');
    input.disabled = false;
    input.focus();
  }
  
  async submitAnswer() {
    if (this.isProcessing) return;
    
    const input = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    const userAnswer = input.value.trim();
    
    if (!userAnswer) return;
    
    this.isProcessing = true;
    submitBtn.disabled = true;
    input.disabled = true;
    
    // Add user message
    this.addUserMessage(userAnswer);
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    await this.showTypingIndicator();
    
    // Validate answer
    const question = this.questions[this.currentQuestionIndex];
    const validation = await api.validateAnswer(
      userAnswer,
      question.expectedAnswer,
      question.question
    );
    
    // Save answer to state
    state.addAnswer({
      questionId: question.id,
      moduleId: question.moduleId,
      question: question.question,
      userAnswer,
      expectedAnswer: question.expectedAnswer,
      isCorrect: validation.isCorrect,
      isPartial: validation.isPartial,
      confidence: validation.confidence,
      feedback: validation.feedback,
      timestamp: new Date().toISOString()
    });
    
    // Remove typing indicator
    this.removeTypingIndicator();
    
    // Show feedback
    await sleep(300);
    this.addFeedbackMessage(validation);
    
    // Move to next question
    this.currentQuestionIndex++;
    this.isProcessing = false;
    
    await sleep(1500);
    this.showNextQuestion();
  }
  
  addAIMessage(text) {
    const container = document.getElementById('messages-container');
    const message = document.createElement('div');
    message.className = 'message-ai animate-slideUp';
    message.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>
      <div class="message-content">
        <p>${sanitizeHTML(text)}</p>
      </div>
    `;
    container.appendChild(message);
    this.scrollToBottom();
  }
  
  addUserMessage(text) {
    const container = document.getElementById('messages-container');
    const message = document.createElement('div');
    message.className = 'message-user animate-slideUp';
    message.innerHTML = `
      <div class="message-content">
        <p>${sanitizeHTML(text)}</p>
      </div>
    `;
    container.appendChild(message);
    this.scrollToBottom();
  }
  
  addFeedbackMessage(validation) {
    const container = document.getElementById('messages-container');
    const message = document.createElement('div');
    message.className = 'message-ai animate-slideUp';
    
    let emoji = '';
    let statusClass = '';
    if (validation.isCorrect) {
      emoji = '✓';
      statusClass = 'feedback-correct';
    } else if (validation.isPartial) {
      emoji = '~';
      statusClass = 'feedback-partial';
    } else {
      emoji = '•';
      statusClass = 'feedback-incorrect';
    }
    
    message.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>
      <div class="message-content ${statusClass}">
        <div class="feedback-header">
          <span class="feedback-icon">${emoji}</span>
          <span class="feedback-status">
            ${validation.isCorrect ? 'Correct' : validation.isPartial ? 'Partially Correct' : 'Needs Review'}
          </span>
        </div>
        <p>${sanitizeHTML(validation.feedback)}</p>
      </div>
    `;
    container.appendChild(message);
    this.scrollToBottom();
  }
  
  async showTypingIndicator() {
    const container = document.getElementById('messages-container');
    const indicator = document.createElement('div');
    indicator.className = 'message-ai typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="message-avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    container.appendChild(indicator);
    this.scrollToBottom();
  }
  
  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    
    const percentage = Math.round((this.currentQuestionIndex / this.questions.length) * 100);
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    progressPercentage.textContent = `${percentage}%`;
  }
  
  scrollToBottom() {
    const container = document.getElementById('messages-container');
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
  
  completeAssessment() {
    // Calculate final results
    const results = state.calculateResults();
    
    showToast('Assessment complete!', 'success');
    
    // Navigate to results
    router.navigate('results');
  }
}
