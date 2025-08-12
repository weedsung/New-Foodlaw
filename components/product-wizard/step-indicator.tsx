"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
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

export function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick,
  className 
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>시작</span>
          <span>완료</span>
        </div>
      </div>

      {/* Step Circles */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full px-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === currentStep
            const isCompleted = stepNumber < currentStep
            const isClickable = onStepClick && (stepNumber <= currentStep || isCompleted)

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center min-w-0">
                  <button
                    onClick={() => isClickable && onStepClick?.(stepNumber)}
                    disabled={!isClickable}
                    className={cn(
                      "rounded-full flex items-center justify-center transition-all duration-200",
                      "w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-medium",
                      {
                        "bg-blue-500 text-white shadow-lg": isActive,
                        "bg-green-500 text-white": isCompleted,
                        "bg-gray-300 text-gray-600": !isActive && !isCompleted,
                        "hover:bg-blue-600 cursor-pointer": isClickable && !isCompleted,
                        "cursor-not-allowed": !isClickable,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      stepNumber
                    )}
                  </button>
                  <span 
                    className={cn(
                      "text-[10px] sm:text-xs mt-1 whitespace-nowrap text-center",
                      {
                        "text-blue-600 font-medium": isActive,
                        "text-green-600 font-medium": isCompleted,
                        "text-gray-500": !isActive && !isCompleted,
                      }
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                      {step.description}
                    </span>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      "h-1 w-8 sm:w-16 transition-colors duration-200",
                      stepNumber < currentStep ? "bg-green-500" : "bg-gray-300"
                    )}
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
