"use client"

import React, { useState } from "react"
import { ProductWizardSimple } from "./product-wizard-simple"

export function DemoPageSimple() {
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
      <ProductWizardSimple
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    maxWidth: '28rem',
    width: '100%',
    margin: '0 1rem'
  }

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s'
  }

  const featureListStyle = {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          제품 등록 마법사 데모
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          기존 HTML을 React로 변환한 제품 등록 마법사를 테스트해보세요.
        </p>
        
        <button
          onClick={() => setShowWizard(true)}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          🚀 제품 등록 마법사 시작
        </button>
        
        <div style={featureListStyle}>
          <h3 style={{
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            구현된 기능:
          </h3>
          <ul style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: '1.5'
          }}>
            <li style={{ marginBottom: '0.25rem' }}>✅ 4단계 스텝 인디케이터</li>
            <li style={{ marginBottom: '0.25rem' }}>✅ 단계별 네비게이션</li>
            <li style={{ marginBottom: '0.25rem' }}>✅ 제품 정보 입력 (Step 1)</li>
            <li style={{ marginBottom: '0.25rem' }}>✅ 인라인 스타일로 안정적 렌더링</li>
            <li style={{ marginBottom: '0.25rem' }}>⏳ 재료 입력 (Step 2) - 예정</li>
            <li style={{ marginBottom: '0.25rem' }}>⏳ 영양성분 (Step 3) - 예정</li>
            <li>⏳ 표시사항 (Step 4) - 예정</li>
          </ul>
        </div>

        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#dbeafe',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: '#1d4ed8'
        }}>
          <strong>💡 개선사항:</strong> Tailwind CSS 의존성을 제거하고 인라인 스타일을 사용하여 UI 렌더링 문제를 해결했습니다.
        </div>
      </div>
    </div>
  )
}
