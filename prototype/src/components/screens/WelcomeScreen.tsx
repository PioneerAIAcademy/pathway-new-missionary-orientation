import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(name || 'Missionary');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '35rem',
        fontWeight: 900,
        color: 'rgba(110, 86, 207, 0.03)',
        pointerEvents: 'none',
        userSelect: 'none',
        lineHeight: 1
      }}>
        ?
      </div>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        animation: 'fadeIn 0.6s ease'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          background: 'rgba(110, 86, 207, 0.15)',
          border: '1px solid rgba(110, 86, 207, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 16px',
          marginBottom: 'var(--space-8)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--accent-secondary)',
          letterSpacing: '0.5px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
          NEW MISSIONARY ORIENTATION
        </div>

        {/* Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 'var(--space-6)',
          letterSpacing: '-0.02em'
        }}>
          Find what you{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6e56cf, #8b7bd8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'relative'
          }}>
            already know.
          </span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 'var(--space-10)',
          maxWidth: '500px'
        }}>
          Skip the training you don't need. Our adaptive assessment identifies your strengths and builds a personalized orientation path.
        </p>

        {/* CTA and Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onStart('Missionary')}
            style={{
              background: 'var(--accent-primary)',
              border: 'none',
              color: 'white',
              padding: '16px 32px',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(110, 86, 207, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-secondary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(110, 86, 207, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(110, 86, 207, 0.4)';
            }}
          >
            Get Started
            <span style={{ fontSize: '1.5rem', lineHeight: 0 }}>→</span>
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                TIME
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}>
                15-25 mins
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                PRIVACY
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}>
                Saved Locally
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};