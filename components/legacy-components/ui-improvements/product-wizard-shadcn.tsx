"use client"

import React, { useState } from "react"
import { StepIndicatorShadcn, DEFAULT_STEPS } from "./step-indicator-shadcn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, X, Bot, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductWizardData {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  ingredients: any[]
  nutrition: any[]
  labeling: any[]
}

interface ProductWizardShadcnProps {
  onSave?: (data: ProductWizardData) => void
  onCancel?: () => void
  initialData?: Partial<ProductWizardData>
  className?: string
}

export function ProductWizardShadcn({ 
  onSave, 
  onCancel,
  initialData = {},
  className
}: ProductWizardShadcnProps) {
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

  const updateWizardData = (field: keyof ProductWizardData, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header - shadcn/ui 스타일 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">
              FoodLaw
            </div>
            <Badge variant="secondary" className="text-xs">
              제품 등록 마법사
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              className="h-8"
            >
              <Save className="mr-2 size-4" />
              저장
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onCancel}
              className="h-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-6 max-w-6xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicatorShadcn
            steps={DEFAULT_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            size="default"
            showProgress={true}
            showLabels={true}
          />
        </div>
        
        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <Card className="border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="w-6 h-6 p-0 rounded-full">1</Badge>
                  제품 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">제품명</Label>
                    <Input
                      id="productName"
                      type="text" 
                      placeholder="제품명을 입력하세요."
                      value={wizardData.productName}
                      onChange={(e) => updateWizardData('productName', e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainIngredients">주요 성분</Label>
                    <Input
                      id="mainIngredients"
                      type="text" 
                      placeholder="주요 성분을 입력하세요."
                      value={wizardData.mainIngredients}
                      onChange={(e) => updateWizardData('mainIngredients', e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button"
                    className="flex-1 sm:flex-none"
                    disabled={!wizardData.productName || !wizardData.mainIngredients}
                  >
                    <Bot className="mr-2 size-4" />
                    AI 분석 시작
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="w-6 h-6 p-0 rounded-full">2</Badge>
                  재료 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">제품 기본 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">제품명:</span>
                        <span className="font-medium">{wizardData.productName || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">제품유형:</span>
                        <span className="font-medium">{wizardData.productType || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">총 중량:</span>
                        <span className="font-medium">{wizardData.totalWeight}g</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">주요 성분</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {wizardData.mainIngredients || '입력된 주요 성분이 없습니다.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">재료 입력 테이블</p>
                  <p className="text-sm">동적 테이블, 행 추가/삭제, AI 자동채우기 기능이 구현될 예정입니다.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">동적 테이블</Badge>
                    <Badge variant="outline">행 추가/삭제</Badge>
                    <Badge variant="outline">AI 자동채우기</Badge>
                    <Badge variant="outline">법령 분석</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="w-6 h-6 p-0 rounded-full">3</Badge>
                  영양성분 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">영양성분 입력</p>
                  <p className="text-sm">열량, 탄수화물, 단백질, 지방, 나트륨 등의 영양성분을 입력할 수 있습니다.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">영양성분 테이블</Badge>
                    <Badge variant="outline">DB 연결</Badge>
                    <Badge variant="outline">AI 분석</Badge>
                    <Badge variant="outline">자동 계산</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="border-primary/20">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default" className="w-6 h-6 p-0 rounded-full">4</Badge>
                  표시사항
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium mb-2">표시사항 관리</p>
                  <p className="text-sm">제품 라벨링에 필요한 모든 표시사항을 관리할 수 있습니다.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">표시사항 미리보기</Badge>
                    <Badge variant="outline">표시사항 작성</Badge>
                    <Badge variant="outline">AI 식품유형 분석</Badge>
                    <Badge variant="outline">법령 분석</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center border-t pt-6">
          <Button 
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="size-4" />
            이전 단계
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>단계 {currentStep} / {DEFAULT_STEPS.length}</span>
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep === DEFAULT_STEPS.length}
            className="flex items-center gap-2"
          >
            다음 단계
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
