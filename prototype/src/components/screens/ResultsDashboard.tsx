import React, { useState } from 'react';
import { AssessmentState } from '../../utils/storage';
import { MODULES, TRAINING_LINKS } from '../../data/questions';
import { Trophy, AlertCircle, CheckCircle, ExternalLink, RotateCcw, Mail, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsDashboardProps {
  state: AssessmentState;
  onRetakeAssessment: () => void;
  onRetakeModule: (moduleId: number) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  state,
  onRetakeAssessment,
  onRetakeModule
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  if (!state.results) return null;

  const { results } = state;
  const masteredModules = results.moduleScores.filter(m => m.score >= 80);
  const needsReviewModules = results.moduleScores.filter(m => m.score < 80).sort((a, b) => a.score - b.score);

  const toggleModule = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getPriorityLabel = (score: number): { label: string; color: string } => {
    if (score < 50) return { label: 'HIGH', color: 'var(--error)' };
    if (score < 70) return { label: 'MEDIUM', color: 'var(--warning)' };
    return { label: 'LOW', color: 'var(--info)' };
  };

  const handleEmailResults = () => {
    const subject = encodeURIComponent('BYU-Pathway Assessment Results');
    const body = encodeURIComponent(`
Assessment Results for ${state.name || 'Missionary'}

Overall Score: ${results.overallScore}%
Topics Mastered: ${results.masteredTopics.length}
Topics Needing Review: ${results.needsReviewTopics.length}

Module Scores:
${results.moduleScores.map(m => `- ${m.moduleName}: ${m.score}%`).join('\n')}

Completed: ${new Date(results.generatedAt).toLocaleDateString()}
    `);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: 'var(--space-12) var(--space-6)',
      animation: 'fadeIn 0.5s ease'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto var(--space-4)',
          background: results.overallScore >= 80 
            ? 'linear-gradient(135deg, var(--success), #059669)' 
            : 'linear-gradient(135deg, var(--warning), #d97706)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <Trophy size={40} color="white" />
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: 'var(--space-3)'
        }}>
          Assessment Complete!
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-6)'
        }}>
          Here's your personalized training plan
        </p>
      </div>

      {/* Overall Score Card */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: 700,
          color: results.overallScore >= 80 ? 'var(--success)' : 'var(--warning)',
          marginBottom: 'var(--space-4)'
        }}>
          {results.overallScore}%
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-8)',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Topics Mastered
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--success)' }}>
              {results.masteredTopics.length}/{results.masteredTopics.length + results.needsReviewTopics.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Needs Review
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--warning)' }}>
              {results.needsReviewTopics.length}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
              Questions Answered
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              {results.totalQuestionsAnswered}
            </div>
          </div>
        </div>
      </div>

      {/* Mastered Modules */}
      {masteredModules.length > 0 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <CheckCircle size={24} color="var(--success)" />
            You Know Well
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {masteredModules.map(module => (
              <div
                key={module.moduleId}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    Module {module.moduleId}: {module.moduleName}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {module.correctAnswers} of {module.totalQuestions} questions correct
                  </div>
                </div>

                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--success)',
                  marginRight: 'var(--space-4)'
                }}>
                  {module.score}%
                </div>

                <CheckCircle size={32} color="var(--success)" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Review Modules */}
      {needsReviewModules.length > 0 && (
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <AlertCircle size={24} color="var(--warning)" />
            Recommended Training
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {needsReviewModules.map((module, index) => {
              const priority = getPriorityLabel(module.score);
              const isExpanded = expandedModules.has(module.moduleId);
              const moduleData = MODULES.find(m => m.id === module.moduleId);
              const trainingUrl = TRAINING_LINKS[module.moduleId];

              return (
                <div
                  key={module.moduleId}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `2px solid ${index === 0 ? 'var(--warning)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-5)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--space-4)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                          {index + 1}. Module {module.moduleId}: {module.moduleName}
                        </h3>
                        <span style={{
                          background: priority.color,
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {priority.label}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                        Current score: {module.score}% ({module.correctAnswers}/{module.totalQuestions} correct)
                      </div>
                    </div>

                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: 'var(--warning)',
                      marginLeft: 'var(--space-4)'
                    }}>
                      {module.score}%
                    </div>
                  </div>

                  {/* Topics List */}
                  {isExpanded && moduleData && (
                    <div style={{
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      marginBottom: 'var(--space-4)'
                    }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                        Topics to review:
                      </div>
                      <ul style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        paddingLeft: 'var(--space-5)',
                        margin: 0
                      }}>
                        {moduleData.topics.map(topic => (
                          <li key={topic.id} style={{ marginBottom: '4px' }}>
                            {topic.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {trainingUrl && (
                      <a
                        href={trainingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'var(--accent-primary)',
                          color: 'white',
                          padding: 'var(--space-3) var(--space-5)',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--accent-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--accent-primary)';
                        }}
                      >
                        <ExternalLink size={16} />
                        View Training Materials
                      </a>
                    )}

                    <button
                      onClick={() => onRetakeModule(module.moduleId)}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-secondary)',
                        color: 'var(--text-primary)',
                        padding: 'var(--space-3) var(--space-5)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <RotateCcw size={16} />
                      Retake Module
                    </button>

                    <button
                      onClick={() => toggleModule(module.moduleId)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-primary)',
                        padding: 'var(--space-3) var(--space-4)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details
                          <ChevronUp size={16} />
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronDown size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          marginBottom: 'var(--space-4)'
        }}>
          Next Steps
        </h2>

        <ol style={{
          color: 'var(--text-secondary)',
          paddingLeft: 'var(--space-6)',
          margin: 0,
          lineHeight: 1.8
        }}>
          <li>Complete the recommended training modules (links above)</li>
          <li>Come back and take a focused re-assessment on those topics</li>
          <li>Schedule your meeting with the orientation trainer</li>
        </ol>

        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          💡 <strong style={{ color: 'var(--text-primary)' }}>Pro tip:</strong> Your trainer will receive this report automatically. Focus on the high-priority areas first.
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onRetakeAssessment}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-secondary)',
            color: 'var(--text-primary)',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-quaternary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)';
          }}
        >
          <RotateCcw size={20} />
          Retake Full Assessment
        </button>

        <button
          onClick={handleEmailResults}
          style={{
            background: 'var(--accent-primary)',
            border: 'none',
            color: 'white',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-primary)';
          }}
        >
          <Mail size={20} />
          Email Results
        </button>
      </div>

      <div style={{
        marginTop: 'var(--space-8)',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-tertiary)'
      }}>
        Assessment completed on {new Date(results.generatedAt).toLocaleDateString()} at {new Date(results.generatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};
