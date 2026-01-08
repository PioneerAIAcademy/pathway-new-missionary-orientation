import React, { useState } from 'react';
import { ArrowLeft, Lock, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string, email?: string) => void;
  onBack?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim(), email.trim() || undefined);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
  };

  const isFormValid = name.trim().length > 0;

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Image with Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/assets/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.4,
        filter: 'brightness(0.6) saturate(1.2)',
        pointerEvents: 'none'
      }} />

      {/* Gradient Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 50%, rgba(10, 10, 10, 0.5) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Light Focus Effect */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(110, 86, 207, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        padding: 'var(--space-8) var(--space-12)',
        gap: 'var(--space-16)',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Column - Text Content */}
        <div style={{
          flex: '1 1 55%',
          maxWidth: '650px',
          animation: 'fadeIn 0.6s ease'
        }}>
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '8px 0',
                marginBottom: 'var(--space-6)',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'rgba(110, 86, 207, 0.15)',
            border: '1px solid rgba(110, 86, 207, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 16px',
            marginBottom: 'var(--space-6)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--accent-secondary)',
            letterSpacing: '0.5px',
            backdropFilter: 'blur(10px)'
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
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: 'var(--space-5)',
            letterSpacing: '-0.02em'
          }}>
            Find what you{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6e56cf, #8b7bd8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              already know.
            </span>
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: 'var(--space-8)',
            maxWidth: '500px'
          }}>
            Skip the training you don't need. Our adaptive assessment identifies your strengths and builds a personalized orientation path.
          </p>

          {/* Info Cards */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-6)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(42, 42, 42, 0.6)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-5)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: '0.6875rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                ESTIMATED TIME
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}>
                15-25 minutes
              </div>
            </div>

            <div style={{
              background: 'rgba(42, 42, 42, 0.6)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-5)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <Shield size={18} color="var(--success)" />
              <div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '2px'
                }}>
                  PRIVACY
                </div>
                <div style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}>
                  Saved Locally
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div style={{
          flex: '1 1 40%',
          maxWidth: '420px',
          minWidth: '320px',
          animation: 'slideUp 0.6s ease 0.1s backwards'
        }}>
          <div style={{
            background: 'rgba(26, 26, 26, 0.9)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            backdropFilter: 'blur(20px)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--space-2)',
              color: 'var(--text-primary)'
            }}>
              Enter Your Information
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)'
            }}>
              We'll personalize your assessment experience
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Full Name (Elder or Sister Name) <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(110, 86, 207, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Email Address or Missionary ID
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or ID (optional)"
                  style={{
                    width: '100%',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(110, 86, 207, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    flex: '0 0 auto',
                    background: 'transparent',
                    border: '1px solid var(--border-secondary)',
                    color: 'var(--text-secondary)',
                    padding: 'var(--space-3) var(--space-5)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-secondary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  Reset
                </button>

                {/* CTA Button with Shiny Effect */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    flex: 1,
                    position: 'relative',
                    background: isFormValid ? 'var(--accent-primary)' : 'var(--bg-quaternary)',
                    border: 'none',
                    color: isFormValid ? 'white' : 'var(--text-tertiary)',
                    padding: 'var(--space-3) var(--space-6)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: isFormValid 
                      ? isHovered 
                        ? '0 6px 24px rgba(110, 86, 207, 0.5)' 
                        : '0 4px 16px rgba(110, 86, 207, 0.4)'
                      : 'none',
                    transform: isHovered && isFormValid ? 'translateY(-2px)' : 'translateY(0)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Shiny border-bottom effect for larger screens */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isHovered && isFormValid ? '80%' : '0%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                    transition: 'width 0.3s ease',
                    borderRadius: '2px'
                  }} />
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: isFormValid ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                    boxShadow: isFormValid ? '0 0 10px 2px rgba(255, 255, 255, 0.3)' : 'none'
                  }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    Start Assessment →
                  </span>
                </button>
              </div>

              {/* Security Notice */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)'
              }}>
                <Lock size={12} />
                <span>Secure & Private — Your data stays on your device</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation on larger screens */}
      <style>{`
        @media (min-width: 768px) {
          .shiny-button::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(255,255,255,0.1) 20%,
              rgba(255,255,255,0.6) 50%,
              rgba(255,255,255,0.1) 80%,
              transparent 100%
            );
            animation: shimmerBorder 2s infinite;
          }
        }
        
        @keyframes shimmerBorder {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 900px) {
          .welcome-container {
            flex-direction: column !important;
            padding: var(--space-6) !important;
          }
        }
      `}</style>
    </div>
  );
};