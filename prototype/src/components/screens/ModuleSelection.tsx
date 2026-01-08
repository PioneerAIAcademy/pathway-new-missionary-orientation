import React, { useState } from 'react';
import { MODULES } from '../../data/questions';
import { Check } from 'lucide-react';

interface ModuleSelectionProps {
  onSelectModules: (selectedModules: number[]) => void;
  onBack: () => void;
}

export const ModuleSelection: React.FC<ModuleSelectionProps> = ({ onSelectModules, onBack }) => {
  const [selected, setSelected] = useState<Set<number>>(new Set([1, 2, 3])); // Default: first 3 modules

  const toggleModule = (moduleId: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelected(newSelected);
  };

  const totalMinutes = MODULES
    .filter(m => selected.has(m.id))
    .reduce((sum, m) => sum + m.estimatedMinutes, 0);

  const handleStart = () => {
    if (selected.size === 0) {
      alert('Please select at least one module');
      return;
    }
    onSelectModules(Array.from(selected));
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: 'var(--space-16) var(--space-6)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: 'var(--space-3)'
        }}>
          Select modules to assess
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)'
        }}>
          Choose the topics you want to be evaluated on
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {MODULES.map(module => {
          const isSelected = selected.has(module.id);
          const topicCount = module.topics.length;
          
          return (
            <div
              key={module.id}
              onClick={() => toggleModule(module.id)}
              style={{
                background: 'var(--bg-secondary)',
                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-secondary)';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: isSelected ? 'none' : '1px solid var(--border-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}>
                {isSelected && <Check size={16} color="white" />}
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary)',
                marginBottom: 'var(--space-2)',
                fontWeight: 500
              }}>
                Module {module.id}
              </div>

              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: 'var(--space-3)',
                paddingRight: 'var(--space-8)'
              }}>
                {module.name}
              </h3>

              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-3)'
              }}>
                {topicCount} topic{topicCount !== 1 ? 's' : ''} · ~{module.estimatedMinutes} min
              </div>

              <div style={{
                width: '100%',
                height: '3px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: isSelected ? '100%' : '0%',
                  height: '100%',
                  background: 'var(--accent-primary)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px' }}>
            Selected: {selected.size} module{selected.size !== 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Estimated time: ~{totalMinutes} minutes
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              color: 'var(--text-primary)',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-quaternary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
          >
            ← Back
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
            disabled={selected.size === 0}
            style={{
              background: selected.size === 0 ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
              border: 'none',
              color: selected.size === 0 ? 'var(--text-tertiary)' : 'white',
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selected.size > 0) {
                e.currentTarget.style.background = 'var(--accent-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selected.size > 0) {
                e.currentTarget.style.background = 'var(--accent-primary)';
              }
            }}
          >
            Start Assessment →
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        fontSize: '0.875rem'
      }}>
        <button
          onClick={() => setSelected(new Set(MODULES.map(m => m.id)))}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          Select All
        </button>
        <span style={{ color: 'var(--text-tertiary)' }}>•</span>
        <button
          onClick={() => setSelected(new Set())}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0
          }}
        >
          Deselect All
        </button>
      </div>
    </div>
  );
};
