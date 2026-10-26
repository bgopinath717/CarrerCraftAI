import React from 'react';

export const ATSScoreGauge = ({ score = 85, size = 120, strokeWidth = 10, showLabel = true, showFraction = true }) => {
  const isFull = score >= 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Visual gap calculation to ensure differences (e.g. 98 vs 100) are unmistakably noticeable
  let gapLength = 0;
  let strokeLength = circumference;
  let gapAngle = 0;

  if (!isFull) {
    const missingPoints = 100 - Math.max(0, Math.min(99.9, score));
    // Noticeable visual gap between the round stroke tips (at least 14px on high scores like 98-99)
    const visualGap = Math.max(14, (missingPoints / 100) * circumference + 6);
    // Add strokeWidth to compensate for round stroke caps extending on each end
    gapLength = Math.min(circumference - strokeWidth * 2, visualGap + strokeWidth);
    strokeLength = Math.max(0, circumference - gapLength);
    gapAngle = (gapLength / circumference) * 360;
  }

  // Symmetrically center the gap directly at the top (12 o'clock)
  const rotation = isFull ? -90 : -90 + (gapAngle / 2);

  const getColor = () => {
    if (score >= 80) return '#16A34A'; // official success green
    if (score >= 60) return '#f59e0b'; // amber warning
    return '#ef4444'; // rose error
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.6s ease'
          }}
        >
          {/* Subtle background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.65}
          />
          {/* Progress circle */}
          {isFull ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getColor()}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getColor()}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }}
            />
          )}
        </svg>

        {/* Center score label */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1
        }}>
          <span style={{
            fontSize: `${size * 0.3}px`,
            fontWeight: 800,
            color: getColor(),
            fontFamily: 'var(--font-heading, var(--font-main, sans-serif))',
            letterSpacing: '-0.02em'
          }}>
            {score}
          </span>
          {showFraction && (
            <span style={{
              fontSize: `${size * 0.12}px`,
              color: 'var(--text-muted)',
              fontWeight: 600,
              marginTop: '3px'
            }}>
              / 100
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <span style={{
          marginTop: '0.5rem',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: getColor(),
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {score >= 80 ? 'ATS Optimized' : score >= 60 ? 'Moderate Match' : 'Needs Optimization'}
        </span>
      )}
    </div>
  );
};

export const KeywordMatcher = ({ foundKeywords = [], missingKeywords = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Found Keywords */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#16A34A' }}>
            ✓ Detected Keywords ({foundKeywords.length})
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {foundKeywords.map((kw, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#F0FDF4',
                color: '#16A34A',
                border: '1px solid rgba(22, 163, 74, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b' }}>
              ! Missing Recommended Keywords ({missingKeywords.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#d97706',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                + {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
