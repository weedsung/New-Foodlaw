"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
// Progress 컴포넌트를 직접 구현

// Step Indicator variants using cva pattern
const stepCircleVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-200 font-medium shrink-0",
  {
    variants: {
      variant: {
        pending: "bg-muted text-muted-foreground border-2 border-muted",
        active: "bg-primary text-primary-foreground border-2 border-primary shadow-lg shadow-primary/20",
        completed: "bg-primary text-primary-foreground border-2 border-primary",
      },
      size: {
        sm: "size-8 text-sm",
        default: "size-10 text-base",
        lg: "size-12 text-lg",
      },
      clickable: {
        true: "hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "cursor-default",
      }
    },
    defaultVariants: {
      variant: "pending",
      size: "default",
      clickable: false,
    },
  }
)

const stepLabelVariants = cva(
  "text-center transition-colors duration-200 font-medium",
  {
    variants: {
      variant: {
        pending: "text-muted-foreground",
        active: "text-primary",
        completed: "text-primary",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      }
    },
    defaultVariants: {
      variant: "pending",
      size: "default",
    },
  }
)

const connectorVariants = cva(
  "h-0.5 transition-colors duration-200 rounded-full",
  {
    variants: {
      state: {
        pending: "bg-border",
        completed: "bg-primary",
      },
      size: {
        sm: "w-8",
        default: "w-16",
        lg: "w-24",
      }
    },
    defaultVariants: {
      state: "pending",
      size: "default",
    },
  }
)

interface Step {
  id: number
  title: string
  description?: string
}

interface StepIndicatorProps extends VariantProps<typeof stepCircleVariants> {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
  showProgress?: boolean
  showLabels?: boolean
}

export function StepIndicatorShadcn({ 
  steps, 
  currentStep, 
  onStepClick,
  size = "default",
  className,
  showProgress = true,
  showLabels = true,
  ...props 
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  const getStepVariant = (stepNumber: number): "pending" | "active" | "completed" => {
    if (stepNumber < currentStep) return "completed"
    if (stepNumber === currentStep) return "active" 
    return "pending"
  }

  const getConnectorState = (stepNumber: number): "pending" | "completed" => {
    return stepNumber < currentStep ? "completed" : "pending"
  }

  const isClickable = (stepNumber: number) => {
    return onStepClick && stepNumber <= currentStep
  }

    return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Step Circles and Labels */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full px-1">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const variant = getStepVariant(stepNumber)
            const clickable = isClickable(stepNumber)

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center min-w-0 group">
                  <button
                    onClick={() => clickable && onStepClick?.(stepNumber)}
                    disabled={!clickable}
                    className={cn(
                      stepCircleVariants({ 
                        variant, 
                        size, 
                        clickable: clickable 
                      }),
                      "outline-none"
                    )}
                    aria-label={`${step.title} - ${variant === "completed" ? "완료됨" : variant === "active" ? "진행 중" : "대기 중"}`}
                  >
                    {variant === "completed" ? (
                      <Check className={cn(
                        "shrink-0",
                        size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5"
                      )} />
                    ) : (
                      stepNumber
                    )}
                  </button>
                  
                  {showLabels && (
                    <div className="mt-2 space-y-1">
                      <span className={cn(
                        stepLabelVariants({ variant, size }),
                        "whitespace-nowrap block"
                      )}>
                        {step.title}
                      </span>
                      {step.description && (
                        <span className="text-xs text-muted-foreground block whitespace-nowrap">
                          {step.description}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      connectorVariants({ 
                        state: getConnectorState(stepNumber), 
                        size 
                      })
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

// 기본 단계 데이터 (HTML에서 추출)
export const DEFAULT_STEPS: Step[] = [
  { id: 1, title: "제품 정보", description: "기본 정보 입력" },
  { id: 2, title: "재료 입력", description: "재료 및 배합비" },
  { id: 3, title: "영양성분", description: "영양 정보 입력" },
  { id: 4, title: "표시사항", description: "라벨링 정보" },
]

export { stepCircleVariants, stepLabelVariants, connectorVariants }
