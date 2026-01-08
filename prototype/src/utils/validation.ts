// Semantic answer validation utilities

export interface ValidationResult {
  isCorrect: boolean;
  confidence: number;
  feedback: string;
}

// Extract keywords from expected answer
const extractKeywords = (text: string): string[] => {
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for', 'on',
    'with', 'as', 'by', 'at', 'from', 'up', 'about', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'and', 'or', 'but', 'if', 'because', 'while',
    'you', 'your', 'it', 'its', 'they', 'them', 'their'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

// Calculate similarity based on keyword overlap
const calculateKeywordSimilarity = (userAnswer: string, expectedAnswer: string): number => {
  const userKeywords = new Set(extractKeywords(userAnswer));
  const expectedKeywords = extractKeywords(expectedAnswer);
  
  if (expectedKeywords.length === 0) return 0;
  
  let matches = 0;
  expectedKeywords.forEach(keyword => {
    if (userKeywords.has(keyword)) {
      matches++;
    }
  });
  
  return matches / expectedKeywords.length;
};

// Check for partial matches with variants
const hasPartialMatch = (userAnswer: string, expectedAnswer: string): boolean => {
  const userLower = userAnswer.toLowerCase();
  const expectedLower = expectedAnswer.toLowerCase();
  
  // Check for common abbreviations and variants
  const variants: Record<string, string[]> = {
    'church': ['lds', 'latter-day saint', 'latter day saint'],
    'zoom': ['video conference', 'video call', 'virtual meeting'],
    'portal': ['website', 'platform', 'system', 'site'],
    'student': ['learner', 'participant'],
    'gathering': ['meeting', 'session', 'class'],
    'missionary': ['volunteer', 'teacher', 'facilitator']
  };
  
  for (const [key, alternates] of Object.entries(variants)) {
    if (expectedLower.includes(key)) {
      for (const alt of alternates) {
        if (userLower.includes(alt)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Main validation function
export const validateAnswer = (
  userAnswer: string,
  expectedAnswer: string,
  question: string
): ValidationResult => {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      isCorrect: false,
      confidence: 0,
      feedback: 'Please provide an answer to continue.'
    };
  }
  
  // Calculate keyword similarity
  const keywordSimilarity = calculateKeywordSimilarity(userAnswer, expectedAnswer);
  
  // Check for partial matches
  const hasPartial = hasPartialMatch(userAnswer, expectedAnswer);
  
  // Combine scores
  let confidence = keywordSimilarity;
  if (hasPartial) {
    confidence = Math.max(confidence, 0.6);
  }
  
  // Determine correctness and feedback
  if (confidence >= 0.7) {
    const feedbacks = [
      "Excellent! That's exactly right. ✓",
      "Perfect! You've got it. ✓",
      "Correct! Well done. ✓",
      "That's right! Great understanding. ✓",
      "Yes! Spot on. ✓"
    ];
    return {
      isCorrect: true,
      confidence,
      feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)]
    };
  } else if (confidence >= 0.5) {
    return {
      isCorrect: true,
      confidence,
      feedback: "You're on the right track! You've captured the main idea, though there might be a small detail to refine."
    };
  } else if (confidence >= 0.3) {
    return {
      isCorrect: false,
      confidence,
      feedback: `You're getting there, but let me help clarify. The key point is: ${expectedAnswer}`
    };
  } else {
    return {
      isCorrect: false,
      confidence,
      feedback: `Not quite. The correct answer is: ${expectedAnswer}\n\nLet's make sure you understand this before moving on.`
    };
  }
};

// Adaptive assessment logic
export const shouldSkipModule = (responses: any[], moduleId: number): boolean => {
  const moduleResponses = responses.filter(r => r.moduleId === moduleId);
  
  if (moduleResponses.length < 3) return false;
  
  const recentResponses = moduleResponses.slice(-3);
  const allCorrect = recentResponses.every(r => r.isCorrect);
  const avgConfidence = recentResponses.reduce((sum, r) => sum + r.confidence, 0) / 3;
  
  return allCorrect && avgConfidence >= 0.8;
};

export const shouldOfferEarlyCompletion = (responses: any[], totalQuestions: number): boolean => {
  if (responses.length < 15) return false;
  
  const correctCount = responses.filter(r => r.isCorrect).length;
  const accuracy = correctCount / responses.length;
  
  return accuracy >= 0.9;
};

export const isStrugglingInModule = (responses: any[], moduleId: number): boolean => {
  const moduleResponses = responses.filter(r => r.moduleId === moduleId);
  
  if (moduleResponses.length < 4) return false;
  
  const recentResponses = moduleResponses.slice(-4);
  const incorrectCount = recentResponses.filter(r => !r.isCorrect).length;
  
  return incorrectCount >= 3;
};
