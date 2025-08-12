"use client"

import React from "react"
import { Check } from "lucide-react"

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

export function StepIndicatorV1({ 
  steps, 
  currentStep, 
  onStepClick,
  className = ""
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 ${className}`}>
      {/* Progress Bar - HTML 스타일 재현 */}
      <div className="mb-8">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>시작</span>
          <span>완료</span>
        </div>
      </div>

      {/* Step Circles - 기존 HTML과 동일한 구조 */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full px-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = onStepClick && (stepNumber <= currentStep || isCompleted)

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="step flex flex-col items-center min-w-0">
                  <button
                    onClick={() => isClickable && onStepClick?.(stepNumber)}
                    disabled={!isClickable}
                    className={`
                      rounded-full text-white flex items-center justify-center step-circle transition-all duration-200
                      w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-medium
                      ${isActive ? 'bg-blue-500 shadow-lg' : ''}
                      ${isCompleted ? 'bg-green-500' : ''}
                      ${!isActive && !isCompleted ? 'bg-gray-300 text-gray-600' : ''}
                      ${isClickable && !isCompleted ? 'hover:bg-blue-600 cursor-pointer' : ''}
                      ${!isClickable ? 'cursor-not-allowed' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      stepNumber
                    )}
                  </button>
                  <span 
                    className={`
                      text-[10px] sm:text-xs mt-1 whitespace-nowrap text-center
                      ${isActive ? 'text-blue-600 font-medium' : ''}
                      ${isCompleted ? 'text-green-600 font-medium' : ''}
                      ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                    `}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                      {step.description}
                    </span>
                  )}
                </div>
                
                {/* Connector Line - HTML과 동일 */}
                {index < steps.length - 1 && (
                  <div 
                    className={`
                      h-1 w-8 sm:w-16 transition-colors duration-200
                      ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 기본 단계 데이터 (HTML에서 추출)
export const DEFAULT_STEPS: Step[] = [
  { id: 1, title: "제품 정보", description: "기본 정보 입력" },
  { id: 2, title: "재료 입력", description: "재료 및 배합비" },
  { id: 3, title: "영양성분", description: "영양 정보 입력" },
  { id: 4, title: "표시사항", description: "라벨링 정보" },
]
