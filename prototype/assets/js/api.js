import { CONFIG } from './config.js';
import { simpleValidation } from './utils.js';

// OpenAI API integration for semantic answer validation

class APIService {
  constructor() {
    this.apiKey = CONFIG.openai.apiKey;
    this.endpoint = CONFIG.openai.endpoint;
    this.model = CONFIG.openai.model;
  }
  
  // Validate answer using OpenAI
  async validateAnswer(userAnswer, expectedAnswer, question) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are an assessment validator for BYU-Pathway missionary training. 
              Your task is to evaluate if a user's answer demonstrates understanding of the expected answer.
              
              Evaluation criteria:
              - Semantic similarity (not exact wording)
              - Key concepts present
              - Practical understanding
              - Accuracy of information
              
              Respond with a JSON object containing:
              {
                "isCorrect": boolean,
                "confidence": number (0-1),
                "feedback": "brief constructive feedback",
                "matchedConcepts": ["list", "of", "key", "concepts", "matched"]
              }`
            },
            {
              role: 'user',
              content: `Question: ${question}
              
Expected Answer: ${expectedAnswer}

User's Answer: ${userAnswer}

Please evaluate if the user's answer demonstrates understanding of the expected answer.`
            }
          ],
          temperature: 0.3, // Low temperature for consistent evaluation
          max_tokens: 300
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON response
      const result = JSON.parse(content);
      
      // Apply threshold
      const isCorrect = result.confidence >= CONFIG.assessment.validationThreshold.correct;
      const isPartial = result.confidence >= CONFIG.assessment.validationThreshold.partial 
        && result.confidence < CONFIG.assessment.validationThreshold.correct;
      
      return {
        isCorrect,
        isPartial,
        confidence: result.confidence,
        feedback: result.feedback,
        matchedConcepts: result.matchedConcepts || [],
        source: 'openai'
      };
      
    } catch (error) {
      console.error('OpenAI validation failed, using fallback:', error);
      
      // Fallback to simple keyword validation
      const fallback = simpleValidation(userAnswer, expectedAnswer);
      return {
        ...fallback,
        isPartial: fallback.confidence >= 0.5 && fallback.confidence < 0.7,
        matchedConcepts: [],
        source: 'fallback'
      };
    }
  }
  
  // Get AI feedback for a specific module
  async getModuleFeedback(moduleId, score, answers) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a supportive training advisor for BYU-Pathway missionaries.
              Provide brief, encouraging, actionable feedback based on assessment performance.
              Keep responses under 100 words. Be specific about what to focus on.`
            },
            {
              role: 'user',
              content: `Module: ${this.getModuleName(moduleId)}
Score: ${score}%
Questions answered: ${answers.length}

Provide brief, encouraging feedback and 2-3 specific areas to focus on for improvement.`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content.trim();
      
    } catch (error) {
      console.error('Failed to get AI feedback:', error);
      return this.getFallbackFeedback(score);
    }
  }
  
  // Fallback feedback for when API fails
  getFallbackFeedback(score) {
    if (score >= 90) {
      return "Excellent work! You've demonstrated strong understanding of this material. Keep up the great work!";
    } else if (score >= 70) {
      return "Good job! You have a solid grasp of the core concepts. Review the material once more to strengthen your understanding.";
    } else if (score >= 50) {
      return "You're making progress! Focus on the key concepts and practical applications. Review the training materials and try again.";
    } else {
      return "This material needs more attention. Take time to thoroughly review the training content and practice applying these concepts.";
    }
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
  
  // Check API health
  async checkHealth() {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const api = new APIService();
