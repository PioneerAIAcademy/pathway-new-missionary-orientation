import React, { useState, useEffect, useRef } from 'react';
import { AssessmentState, QuestionResponse, updateProgress, calculateResults } from '../../utils/storage';
import { getAllQuestions } from '../../data/questions';
import { validateAnswer, shouldSkipModule, shouldOfferEarlyCompletion, isStrugglingInModule } from '../../utils/validation';
import { MODULES } from '../../data/questions';
import { AlertCircle, CheckCircle, HelpCircle, Send, Bot, Sparkles } from 'lucide-react';

interface AssessmentProps {
  state: AssessmentState;
  onComplete: (state: AssessmentState) => void;
  onUpdateState: (state: AssessmentState) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ state, onComplete, onUpdateState }) => {
  const [userInput, setUserInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(state.progress.currentQuestionIndex || 0);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<Record<number, number>>({});
  const [showIntro, setShowIntro] = useState(currentQuestionIndex === 0 && state.responses.length === 0);
  const inputRef = useRef<HTMLInputElement>(null);

  const questions = getAllQuestions(state.mode === 'topic-selection' ? state.selectedModules : undefined);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQuestionIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !currentQuestion) return;

    const answer = userInput.trim();
    setUserInput('');

    // Validate answer
    const validation = validateAnswer(answer, currentQuestion.expectedAnswer, currentQuestion.text);

    // Store response
    const response: QuestionResponse = {
      questionId: currentQuestion.id,
      question: currentQuestion.text,
      expectedAnswer: currentQuestion.expectedAnswer,
      userAnswer: answer,
      isCorrect: validation.isCorrect,
      confidence: validation.confidence,
      feedback: validation.feedback,
      timestamp: new Date().toISOString(),
      moduleId: currentQuestion.moduleId,
      topicId: currentQuestion.topicId
    };

    const newResponses = [...state.responses, response];
    
    // Update consecutive correct count
    const newConsecutive = { ...consecutiveCorrect };
    if (validation.isCorrect) {
      newConsecutive[currentQuestion.moduleId] = (newConsecutive[currentQuestion.moduleId] || 0) + 1;
    } else {
      newConsecutive[currentQuestion.moduleId] = 0;
    }
    setConsecutiveCorrect(newConsecutive);

    // Show feedback
    setLastFeedback({
      isCorrect: validation.isCorrect,
      message: validation.feedback
    });

    // Update state
    let updatedState: AssessmentState = {
      ...state,
      responses: newResponses,
      progress: {
        ...state.progress,
        currentQuestionIndex: currentQuestionIndex + 1,
        questionsAnswered: newResponses.length,
        totalQuestions: questions.length,
        percentComplete: Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
      }
    };
    updatedState = updateProgress(updatedState, questions.length);
    onUpdateState(updatedState);

    // Check for adaptive decisions
    setTimeout(() => {
      checkAdaptiveLogic(newResponses, newConsecutive);
    }, 2000);
  };

  const checkAdaptiveLogic = (responses: QuestionResponse[], consecutive: Record<number, number>) => {
    if (!currentQuestion) return;

    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      completeAssessment();
      return;
    }

    // Check if should skip current module
    if (shouldSkipModule(responses, currentQuestion.moduleId) && consecutive[currentQuestion.moduleId] >= 3) {
      const moduleInfo = MODULES.find(m => m.id === currentQuestion.moduleId);
      setLastFeedback({
        isCorrect: true,
        message: `🎉 Excellent work on ${moduleInfo?.name}! You've demonstrated strong knowledge. Skipping to next module...`
      });
      
      setTimeout(() => {
        skipToNextModule();
      }, 2000);
      return;
    }

    // Check if should offer early completion
    if (shouldOfferEarlyCompletion(responses, questions.length) && nextIndex > questions.length * 0.6) {
      setTimeout(() => {
        completeAssessment();
      }, 2000);
      return;
    }

    // Move to next question
    setTimeout(() => {
      setLastFeedback(null);
      setCurrentQuestionIndex(nextIndex);
    }, 2000);
  };

  const skipToNextModule = () => {
    if (!currentQuestion) return;

    const currentModuleId = currentQuestion.moduleId;
    const nextIndex = questions.findIndex((q, idx) => idx > currentQuestionIndex && q.moduleId !== currentModuleId);

    if (nextIndex === -1) {
      completeAssessment();
      return;
    }

    const updatedState = {
      ...state,
      completedModules: [...state.completedModules, currentModuleId]
    };
    onUpdateState(updatedState);

    setTimeout(() => {
      setLastFeedback(null);
      setCurrentQuestionIndex(nextIndex);
    }, 1000);
  };

  const completeAssessment = () => {
    const results = calculateResults(state, MODULES);
    const finalState: AssessmentState = {
      ...state,
      results,
      progress: {
        ...state.progress,
        percentComplete: 100
      }
    };
    
    onComplete(finalState);
  };

  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  if (!currentQuestion) {
    completeAssessment();
    return null;
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        animation: 'fadeIn 0.3s ease'
      }}>
        {/* Header with Progress */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: 'var(--space-5)',
          borderBottom: 'none'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-3)'
          }}>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px' }}>
                Orientation Assessment
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Module: <span style={{ color: 'var(--accent-primary)' }}>{currentQuestion.moduleName}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {progressPercent}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              transition: 'width 0.5s ease',
              borderRadius: 'var(--radius-full)'
            }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          padding: 'var(--space-8)',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* AI Introduction Message */}
          {showIntro && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.1), rgba(110, 86, 207, 0.05))',
              border: '1px solid rgba(110, 86, 207, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              animation: 'slideUp 0.4s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}>
                      Orientation Trainer
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(110, 86, 207, 0.2)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.6875rem',
                      color: 'var(--accent-secondary)',
                      fontWeight: 500
                    }}>
                      <Sparkles size={10} />
                      AI
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-3)'
                  }}>
                    Welcome{state.name ? `, ${state.name}` : ''}! 👋 I'm your orientation trainer, here to help you through your missionary training assessment.
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-3)'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>My mission:</strong> To identify what you already know so you can skip unnecessary training and focus on areas where you need growth.
                  </p>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 'var(--space-4)'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>How this works:</strong> I'll ask you questions about various orientation topics. Answer in your own words — there's no need for perfect responses. I'll provide feedback as we go.
                  </p>
                  <button
                    onClick={() => setShowIntro(false)}
                    style={{
                      background: 'var(--accent-primary)',
                      border: 'none',
                      color: 'white',
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent-primary)';
                    }}
                  >
                    Let's Begin →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {lastFeedback && (
            <div style={{
              background: lastFeedback.isCorrect 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${lastFeedback.isCorrect ? 'var(--success)' : 'var(--error)'}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              animation: 'slideUp 0.3s ease'
            }}>
              {lastFeedback.isCorrect ? (
                <CheckCircle size={20} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle size={20} color="var(--error)" style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              <div style={{
                color: lastFeedback.isCorrect ? 'var(--success)' : 'var(--error)',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}>
                {lastFeedback.message}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div style={{
            marginBottom: 'var(--space-6)',
            flex: currentQuestion.imageUrl ? 0 : 1
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: currentQuestion.imageUrl ? 'var(--space-6)' : 0,
              color: 'var(--text-primary)'
            }}>
              {currentQuestion.text}
            </h2>
          </div>

          {/* Image if present */}
          {currentQuestion.imageUrl && (
            <div style={{
              marginBottom: 'var(--space-6)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-primary)',
              background: '#000'
            }}>
              <img 
                src={currentQuestion.imageUrl}
                alt={currentQuestion.imageAlt || 'Question illustration'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Input Area */}
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)',
              transition: 'border-color 0.2s ease'
            }}
              onFocus={(e) => {
                const parent = e.currentTarget;
                parent.style.borderColor = 'var(--accent-primary)';
              }}
              onBlur={(e) => {
                const parent = e.currentTarget;
                parent.style.borderColor = 'var(--border-secondary)';
              }}
            >
              <HelpCircle size={20} color="var(--text-tertiary)" style={{ marginLeft: 'var(--space-2)' }} />
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response..."
                disabled={!!lastFeedback}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  padding: 'var(--space-2) 0'
                }}
              />
              <button
                type="submit"
                disabled={!userInput.trim() || !!lastFeedback}
                style={{
                  background: userInput.trim() && !lastFeedback ? 'var(--accent-primary)' : 'var(--bg-quaternary)',
                  border: 'none',
                  color: userInput.trim() && !lastFeedback ? 'white' : 'var(--text-tertiary)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  cursor: userInput.trim() && !lastFeedback ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (userInput.trim() && !lastFeedback) {
                    e.currentTarget.style.background = 'var(--accent-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (userInput.trim() && !lastFeedback) {
                    e.currentTarget.style.background = 'var(--accent-primary)';
                  }
                }}
              >
                <Send size={18} />
              </button>
            </div>

            {/* Hint if available */}
            {currentQuestion.hints && currentQuestion.hints.length > 0 && !lastFeedback && (
              <div style={{
                marginTop: 'var(--space-3)',
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                💡 Need help? Hint: {currentQuestion.hints[0]}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
