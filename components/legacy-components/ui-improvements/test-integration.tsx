"use client"

import React, { useState } from "react"
import { DemoPage } from "./demo-page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TestIntegration() {
  const [showDemo, setShowDemo] = useState(false)

  if (showDemo) {
    return <DemoPage />
  }

  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            🧪 제품 등록 마법사 테스트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            HTML을 React로 변환한 제품 등록 마법사를 테스트해보세요.
          </p>
          <Button 
            onClick={() => setShowDemo(true)}
            className="w-full"
            size="lg"
          >
            🚀 마법사 테스트 시작
          </Button>
          
          <div className="p-4 bg-muted rounded-lg text-sm">
            <h4 className="font-semibold mb-2">구현된 기능:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>✅ 4단계 스텝 인디케이터</li>
              <li>✅ 단계별 네비게이션</li>
              <li>✅ 제품 정보 입력 폼</li>
              <li>✅ 진행률 표시</li>
              <li>✅ 반응형 디자인</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
