"use client"

import React, { useState } from "react"
import { ProductWizardContainer } from "./product-wizard-container"

export function DemoPage() {
  const [showWizard, setShowWizard] = useState(false)

  const handleSave = (data: any) => {
    console.log("저장된 데이터:", data)
    alert("데이터가 저장되었습니다!")
    setShowWizard(false)
  }

  const handleCancel = () => {
    setShowWizard(false)
  }

  if (showWizard) {
    return (
      <ProductWizardContainer
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          제품 등록 마법사 데모
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          기존 HTML을 React로 변환한 제품 등록 마법사를 테스트해보세요.
        </p>
        <button
          onClick={() => setShowWizard(true)}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all font-semibold"
        >
          🚀 제품 등록 마법사 시작
        </button>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">구현된 기능:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ 4단계 스텝 인디케이터</li>
            <li>✅ 단계별 네비게이션</li>
            <li>✅ 제품 정보 입력 (Step 1)</li>
            <li>⏳ 재료 입력 (Step 2) - 예정</li>
            <li>⏳ 영양성분 (Step 3) - 예정</li>
            <li>⏳ 표시사항 (Step 4) - 예정</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
