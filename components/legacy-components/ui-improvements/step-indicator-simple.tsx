"use client"

import React from "react"

interface Step {
  id: number
  title: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export function StepIndicatorSimple({ 
  steps, 
  currentStep, 
  onStepClick,
  className = ""
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '64rem', 
      margin: '0 auto', 
      padding: '0 1rem' 
    }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#d1d5db',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: '9999px',
              transition: 'width 0.5s ease-out',
              width: `${progress}%`
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <span>시작</span>
          <span>완료</span>
        </div>
      </div>

      {/* Step Circles */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          maxWidth: '100%',
          padding: '0 0.25rem'
        }}>
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = onStepClick && (stepNumber <= currentStep || isCompleted)

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '0'
                }}>
                  <button
                    onClick={() => isClickable && onStepClick?.(stepNumber)}
                    disabled={!isClickable}
                    style={{
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2.5rem',
                      height: '2.5rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: isClickable ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      backgroundColor: isActive ? '#3b82f6' : 
                                     isCompleted ? '#10b981' : '#9ca3af'
                    }}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </button>
                  <span style={{
                    fontSize: '0.75rem',
                    marginTop: '0.25rem',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    color: isActive ? '#3b82f6' : 
                           isCompleted ? '#10b981' : '#6b7280',
                    fontWeight: isActive || isCompleted ? '500' : 'normal'
                  }}>
                    {step.title}
                  </span>
                  {step.description && (
                    <span style={{
                      fontSize: '0.625rem',
                      color: '#9ca3af',
                      marginTop: '0.125rem',
                      whiteSpace: 'nowrap'
                    }}>
                      {step.description}
                    </span>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div style={{
                    height: '4px',
                    width: '4rem',
                    backgroundColor: stepNumber < currentStep ? '#10b981' : '#d1d5db',
                    transition: 'background-color 0.2s'
                  }} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 기본 단계 데이터
export const DEFAULT_STEPS: Step[] = [
  { id: 1, title: "제품 정보", description: "기본 정보 입력" },
  { id: 2, title: "재료 입력", description: "재료 및 배합비" },
  { id: 3, title: "영양성분", description: "영양 정보 입력" },
  { id: 4, title: "표시사항", description: "라벨링 정보" },
]
