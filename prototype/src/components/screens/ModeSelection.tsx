import React from 'react';
import { Grid3x3, Zap, CheckCircle, Clock } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'full-assessment' | 'topic-selection' | 'quick-check') => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)'
    }}>
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        animation: 'fadeIn 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: 'var(--space-3)',
            letterSpacing: '-0.02em'
          }}>
            Choose your path
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)'
          }}>
            Select how you'd like to proceed with your orientation assessment.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          {/* Full Assessment */}
          <div
            onClick={() => onSelectMode('full-assessment')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(110, 86, 207, 0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <Grid3x3 size={24} color="var(--accent-primary)" />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-3)'
            }}>
              Full Assessment
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.6,
              fontSize: '0.9375rem'
            }}>
              Complete evaluation across all 23 topics. Recommended for most.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Adaptive Logic</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Complete Report</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Early Skip</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--text-tertiary)',
              fontSize: '0.875rem',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <Clock size={16} />
              <span>15-25 min</span>
            </div>
          </div>

          {/* Topic Selection */}
          <div
            onClick={() => onSelectMode('topic-selection')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(110, 86, 207, 0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <Grid3x3 size={24} color="var(--accent-primary)" />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-3)'
            }}>
              Topic Selection
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.6,
              fontSize: '0.9375rem'
            }}>
              Choose specific modules you want to be assessed on.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Custom Focus</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Flexible</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Targeted</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--text-tertiary)',
              fontSize: '0.875rem',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <Clock size={16} />
              <span>5-15 min</span>
            </div>
          </div>

          {/* Quick Check */}
          <div
            onClick={() => onSelectMode('quick-check')}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(251, 191, 36, 0.15)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <Zap size={24} color="#fbbf24" />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: 'var(--space-3)'
            }}>
              Quick Check
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.6,
              fontSize: '0.9375rem'
            }}>
              A brief conversation to identify likely knowledge gaps.
            </p>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <span>Fast Start</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <span>High-level</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-2)', 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem' 
              }}>
                <CheckCircle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <span>AI Inference</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--text-tertiary)',
              fontSize: '0.875rem',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-primary)'
            }}>
              <Clock size={16} />
              <span>3-5 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};