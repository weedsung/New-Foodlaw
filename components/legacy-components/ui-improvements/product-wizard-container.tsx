"use client"

import React, { useState } from "react"
import { StepIndicatorV1, DEFAULT_STEPS } from "./step-indicator-v1"
import { Save, X } from "lucide-react"

interface ProductWizardData {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  ingredients: any[]
  nutrition: any[]
  labeling: any[]
}

interface ProductWizardContainerProps {
  onSave?: (data: ProductWizardData) => void
  onCancel?: () => void
  initialData?: Partial<ProductWizardData>
}

export function ProductWizardContainer({ 
  onSave, 
  onCancel,
  initialData = {}
}: ProductWizardContainerProps) {
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
    // 이전 단계로만 이동 가능 (나중에 검증 로직 추가)
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

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header - HTML과 동일한 구조 */}
      <header className="bg-white shadow-sm p-3">
        <div className="flex justify-between items-center w-full">
          <div className="text-2xl font-bold text-blue-600 drop-shadow-sm">
            FoodLaw
          </div>
          <div className="flex flex-row gap-2">
            <button 
              onClick={handleSave}
              className="bg-gray-200 text-gray-700 px-4 py-1 rounded-lg hover:bg-gray-300 transition-all flex items-center"
            >
              <Save className="w-4 h-4 mr-2" /> 저장
            </button>
            <button 
              onClick={onCancel}
              className="text-gray-700 px-4 rounded-lg hover:bg-gray-300 transition-all flex items-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        {/* Step Indicator */}
        <StepIndicatorV1
          steps={DEFAULT_STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        
        {/* Step Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">제품 정보 입력</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  제품명
                  <input 
                    className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" 
                    type="text" 
                    placeholder="제품명을 입력하세요."
                    value={wizardData.productName}
                    onChange={(e) => setWizardData(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </label>
                <label className="block">
                  주요 성분
                  <input 
                    className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" 
                    type="text" 
                    placeholder="주요 성분을 입력하세요."
                    value={wizardData.mainIngredients}
                    onChange={(e) => setWizardData(prev => ({ ...prev, mainIngredients: e.target.value }))}
                  />
                </label>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center w-full md:w-auto"
                >
                  <i className="fas fa-robot mr-2"></i> AI 분석 시작
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">재료 입력</h3>
              <p className="text-gray-600">재료 입력 섹션 - 구현 예정</p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">영양성분 입력</h3>
              <p className="text-gray-600">영양성분 입력 섹션 - 구현 예정</p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">표시사항</h3>
              <p className="text-gray-600">표시사항 섹션 - 구현 예정</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between border-t pt-6">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전 단계
          </button>
          <button 
            onClick={handleNext}
            disabled={currentStep === DEFAULT_STEPS.length}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 단계
          </button>
        </div>
      </main>
    </div>
  )
}
