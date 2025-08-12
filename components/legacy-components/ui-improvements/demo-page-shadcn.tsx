"use client"

import React, { useState } from "react"
import { ProductWizardShadcn } from "./product-wizard-shadcn"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Rocket, CheckCircle, Clock, Lightbulb } from "lucide-react"

export function DemoPageShadcn() {
  const [showWizard, setShowWizard] = useState(false)

  const handleSave = (data: any) => {
    console.log("저장된 데이터:", data)
    // 실제 환경에서는 토스트 알림 사용
    alert("데이터가 저장되었습니다!")
    setShowWizard(false)
  }

  const handleCancel = () => {
    setShowWizard(false)
  }

  if (showWizard) {
    return (
      <ProductWizardShadcn
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">제품 등록 마법사 데모</CardTitle>
              <CardDescription className="mt-2">
                기존 HTML을 shadcn/ui로 완전히 재구성한 제품 등록 마법사를 테스트해보세요.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button
              onClick={() => setShowWizard(true)}
              size="lg"
              className="w-full h-12 text-base"
            >
              <Rocket className="mr-2 w-5 h-5" />
              제품 등록 마법사 시작
            </Button>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                구현된 기능
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">4단계 스텝 인디케이터</span>
                  <Badge variant="default" className="h-5">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">shadcn/ui 디자인 시스템</span>
                  <Badge variant="default" className="h-5">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">cva 패턴 적용</span>
                  <Badge variant="default" className="h-5">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">제품 정보 입력 (Step 1)</span>
                  <Badge variant="default" className="h-5">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    완료
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">재료 입력 (Step 2)</span>
                  <Badge variant="outline" className="h-5">
                    <Clock className="w-3 h-3 mr-1" />
                    예정
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">영양성분 (Step 3)</span>
                  <Badge variant="outline" className="h-5">
                    <Clock className="w-3 h-3 mr-1" />
                    예정
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">표시사항 (Step 4)</span>
                  <Badge variant="outline" className="h-5">
                    <Clock className="w-3 h-3 mr-1" />
                    예정
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="w-full p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">
                    shadcn/ui 완전 적용
                  </p>
                  <p className="text-xs text-muted-foreground">
                    cva 패턴, CSS 변수 기반 테마 시스템, new-york 스타일을 적용하여 
                    기존 앱과 완벽하게 조화되는 디자인을 구현했습니다.
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
