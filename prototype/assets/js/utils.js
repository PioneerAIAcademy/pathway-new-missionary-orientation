// Utility Functions

// Generate unique ID
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate UUID v4
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format time duration
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Calculate percentage
export function calculatePercentage(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

// Clamp number between min and max
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Sleep/delay function
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Format date
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

// Scroll to element smoothly
export function scrollToElement(element, offset = 0) {
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

// Show toast notification
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slideUp`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Extract keywords from text
export function extractKeywords(text) {
  // Remove common words and punctuation
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  return [...new Set(words)]; // Remove duplicates
}

// Simple keyword-based validation (fallback)
export function simpleValidation(userAnswer, expectedAnswer) {
  const userKeywords = extractKeywords(userAnswer);
  const expectedKeywords = extractKeywords(expectedAnswer);
  
  if (expectedKeywords.length === 0) {
    return { isCorrect: false, confidence: 0, feedback: 'Unable to validate' };
  }
  
  const matches = expectedKeywords.filter(keyword => 
    userKeywords.some(userKeyword => 
      userKeyword.includes(keyword) || keyword.includes(userKeyword)
    )
  );
  
  const confidence = matches.length / expectedKeywords.length;
  
  return {
    isCorrect: confidence >= 0.7,
    confidence,
    feedback: confidence >= 0.7 
      ? 'Good understanding of key concepts'
      : confidence >= 0.5
      ? 'Partial understanding, some key points missing'
      : 'Missing important details'
  };
}

// Shuffle array (Fisher-Yates)
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Group array by key
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

// Calculate average
export function average(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// Convert to title case
export function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
