import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ModeSelection } from './screens/ModeSelection';
import { ModuleSelection } from './screens/ModuleSelection';
import { Assessment } from './screens/Assessment';
import { ResultsDashboard } from './screens/ResultsDashboard';
import { loadState, saveState, resetState, getInitialState, AssessmentState } from '../utils/storage';

type Screen = 'welcome' | 'resume-prompt' | 'mode-selection' | 'module-selection' | 'assessment' | 'results';

export const AssessmentApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [state, setState] = useState<AssessmentState>(getInitialState());

  useEffect(() => {
    // Check for existing progress on mount
    const savedState = loadState();
    if (savedState && savedState.mode && !savedState.results) {
      setState(savedState);
      setCurrentScreen('resume-prompt');
    }
  }, []);

  useEffect(() => {
    // Auto-save state whenever it changes
    if (state.mode) {
      saveState(state);
    }
  }, [state]);

  const handleReset = () => {
    if (confirm('⚠️ Reset Your Progress?\n\nThis will permanently delete:\n• Your assessment responses\n• Your results and recommendations\n• Your progress tracking\n\nYou\'ll start from the beginning.')) {
      resetState();
      setState(getInitialState());
      setCurrentScreen('welcome');
    }
  };

  const handleStart = (name: string) => {
    setState(prev => ({
      ...prev,
      name,
      startTime: new Date().toISOString()
    }));
    setCurrentScreen('mode-selection');
  };

  const handleResume = () => {
    setCurrentScreen('assessment');
  };

  const handleStartFresh = () => {
    resetState();
    setState(getInitialState());
    setCurrentScreen('welcome');
  };

  const handleModeSelection = (mode: 'full-assessment' | 'topic-selection' | 'quick-check') => {
    setState(prev => ({
      ...prev,
      mode
    }));

    if (mode === 'topic-selection') {
      setCurrentScreen('module-selection');
    } else {
      setCurrentScreen('assessment');
    }
  };

  const handleModuleSelection = (selectedModules: number[]) => {
    setState(prev => ({
      ...prev,
      selectedModules
    }));
    setCurrentScreen('assessment');
  };

  const handleAssessmentComplete = (updatedState: AssessmentState) => {
    setState(updatedState);
    setCurrentScreen('results');
  };

  const handleRetakeAssessment = () => {
    const newState = getInitialState();
    newState.name = state.name;
    newState.missionaryId = state.missionaryId;
    setState(newState);
    setCurrentScreen('mode-selection');
  };

  const handleRetakeModule = (moduleId: number) => {
    setState(prev => ({
      ...prev,
      mode: 'topic-selection',
      selectedModules: [moduleId],
      responses: prev.responses.filter(r => r.moduleId !== moduleId),
      results: null
    }));
    setCurrentScreen('assessment');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white'
          }}>
            B
          </div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
            BYU Pathway
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {currentScreen !== 'welcome' && (
            <>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  padding: 0,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Help
              </button>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  padding: 0,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Contact Trainer
              </button>
            </>
          )}
          {currentScreen !== 'welcome' && (
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--error)';
                e.currentTarget.style.color = 'var(--error)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-secondary)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              Reset Progress
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentScreen === 'welcome' && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {currentScreen === 'resume-prompt' && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: 'var(--space-16) var(--space-6)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>
                Welcome back, {state.name || 'there'}!
              </h2>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  You have an assessment in progress
                </p>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-2)'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    {state.progress.percentComplete}%
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {state.progress.questionsAnswered} of {state.progress.totalQuestions} questions
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                <button
                  onClick={handleStartFresh}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-primary)',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  Start Fresh
                </button>
                <button
                  onClick={handleResume}
                  style={{
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: 'var(--text-primary)',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                >
                  Continue Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'mode-selection' && (
          <ModeSelection onSelectMode={handleModeSelection} />
        )}

        {currentScreen === 'module-selection' && (
          <ModuleSelection 
            onSelectModules={handleModuleSelection}
            onBack={() => setCurrentScreen('mode-selection')}
          />
        )}

        {currentScreen === 'assessment' && (
          <Assessment
            state={state}
            onComplete={handleAssessmentComplete}
            onUpdateState={setState}
          />
        )}

        {currentScreen === 'results' && state.results && (
          <ResultsDashboard
            state={state}
            onRetakeAssessment={handleRetakeAssessment}
            onRetakeModule={handleRetakeModule}
          />
        )}
      </main>
    </div>
  );
};