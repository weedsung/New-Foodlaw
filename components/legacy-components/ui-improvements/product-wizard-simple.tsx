"use client"

import React, { useState } from "react"
import { StepIndicatorSimple, DEFAULT_STEPS } from "./step-indicator-simple"

interface ProductWizardData {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  ingredients: any[]
  nutrition: any[]
  labeling: any[]
}

interface ProductWizardSimpleProps {
  onSave?: (data: ProductWizardData) => void
  onCancel?: () => void
  initialData?: Partial<ProductWizardData>
}

export function ProductWizardSimple({ 
  onSave, 
  onCancel,
  initialData = {}
}: ProductWizardSimpleProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<ProductWizardData>({
    productName: "",
    mainIngredients: "",
    productType: "",
    totalWeight: 0,
    ingredients: [],
    nutrition: [],
    labeling: [],
    ...initialData
  })

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step)
    }
  }

  const handleNext = () => {
    if (currentStep < DEFAULT_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    onSave?.(wizardData)
  }

  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white'
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    color: 'white'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.25rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  }

  return (
    <div style={{ 
      backgroundColor: '#f3f4f6', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        padding: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2563eb',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            FoodLaw
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleSave}
              style={{
                ...buttonStyle,
                backgroundColor: '#e5e7eb',
                color: '#374151'
              }}
            >
              💾 저장
            </button>
            <button 
              onClick={onCancel}
              style={{
                ...buttonStyle,
                backgroundColor: 'transparent',
                color: '#374151'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </header>
      
      <main style={{
        maxWidth: '112rem',
        margin: '0 auto',
        padding: '1.5rem'
      }}>
        {/* Step Indicator */}
        <StepIndicatorSimple
          steps={DEFAULT_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        
        {/* Step Content */}
        <div style={{ marginTop: '2rem' }}>
          {currentStep === 1 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                제품 정보 입력
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                <label style={{ display: 'block' }}>
                  제품명
                  <input 
                    style={inputStyle}
                    type="text" 
                    placeholder="제품명을 입력하세요."
                    value={wizardData.productName}
                    onChange={(e) => setWizardData(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </label>
                <label style={{ display: 'block' }}>
                  주요 성분
                  <input 
                    style={inputStyle}
                    type="text" 
                    placeholder="주요 성분을 입력하세요."
                    value={wizardData.mainIngredients}
                    onChange={(e) => setWizardData(prev => ({ ...prev, mainIngredients: e.target.value }))}
                  />
                </label>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  style={{
                    ...primaryButtonStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  🤖 AI 분석 시작
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                재료 입력
              </h3>
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <p>재료 입력 섹션 - 구현 예정</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  동적 테이블, 행 추가/삭제, AI 자동채우기 기능이 포함될 예정입니다.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                영양성분 입력
              </h3>
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <p>영양성분 입력 섹션 - 구현 예정</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  열량, 탄수화물, 단백질, 지방, 나트륨 등의 영양성분을 입력할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                표시사항
              </h3>
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <p>표시사항 섹션 - 구현 예정</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  제품 라벨링에 필요한 모든 표시사항을 관리할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1.5rem'
        }}>
          <button 
            onClick={handlePrev}
            disabled={currentStep === 1}
            style={{
              ...secondaryButtonStyle,
              opacity: currentStep === 1 ? 0.5 : 1,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            이전 단계
          </button>
          <button 
            onClick={handleNext}
            disabled={currentStep === DEFAULT_STEPS.length}
            style={{
              ...primaryButtonStyle,
              opacity: currentStep === DEFAULT_STEPS.length ? 0.5 : 1,
              cursor: currentStep === DEFAULT_STEPS.length ? 'not-allowed' : 'pointer'
            }}
          >
            다음 단계
          </button>
        </div>
      </main>
    </div>
  )
}
