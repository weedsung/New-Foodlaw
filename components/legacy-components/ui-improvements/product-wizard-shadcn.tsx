"use client"

import React, { useState, useEffect, useCallback } from "react"
import { StepIndicatorShadcn, DEFAULT_STEPS } from "./step-indicator-shadcn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, X, Bot, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiService } from "@/lib/ai-service"
import { 
  Step1ProductInfo, 
  Step2Ingredients, 
  Step3Nutrition, 
  Step4Labeling 
} from "./steps"

interface Ingredient {
  id: string
  name: string
  weight: number
  ratio: number
  notes: string
}

interface NutritionRow {
  name: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  sugar: number
  sodium: number
  transFat: number
  saturatedFat: number
  cholesterol: number
}

interface LabelingData {
  productName: string
  productType: string
  ingredients: string
  amount: string
  expiry: string
  packaging: string
  reportNo: string
  company: string
  returnPolicy: string
  storage: string
  allergy: string
  customerService: string
  additionalInfo: string
}

interface ProductWizardData {
  productName: string
  productType: string
  totalWeight: number
  ingredients: Ingredient[]
  nutrition: NutritionRow[]
  labeling: LabelingData
}

interface ProductWizardShadcnProps {
  onSave?: (data: ProductWizardData) => void
  onCancel?: () => void
  onComplete?: (data: ProductWizardData) => void
  initialData?: Partial<ProductWizardData>
  initialStep?: number
  className?: string
}

export function ProductWizardShadcn({ 
  onSave, 
  onCancel,
  onComplete,
  initialData = {},
  initialStep = 1,
  className
}: ProductWizardShadcnProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  
  // initialStep이 변경되면 currentStep을 업데이트
  useEffect(() => {
    setCurrentStep(initialStep)
  }, [initialStep])
  
  const [wizardData, setWizardData] = useState<ProductWizardData>({
    productName: initialData.productName || "",
    productType: initialData.productType || "",
    totalWeight: 0,
    ingredients: [],
    nutrition: [],
    labeling: {
      productName: "",
      productType: "",
      ingredients: "",
      amount: "",
      expiry: "",
      packaging: "",
      reportNo: "",
      company: "",
      returnPolicy: "",
      storage: "",
      allergy: "",
      customerService: "",
      additionalInfo: ""
    }
  })

  const [showAIResult, setShowAIResult] = useState(false)
  const [showDirectInput, setShowDirectInput] = useState(false)
  const [aiRecommendations, setAIRecommendations] = useState<string[]>([])
  const [backendConnectionStatus, setBackendConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  // wizardData를 localStorage에 저장
  useEffect(() => {
    if (wizardData.nutrition && wizardData.nutrition.length > 0) {
      localStorage.setItem('wizardData', JSON.stringify(wizardData));
      console.log('wizardData localStorage 저장:', wizardData);
    }
  }, [wizardData]);

  // localStorage에서 wizardData 복원
  useEffect(() => {
    const savedWizardData = localStorage.getItem('wizardData');
    if (savedWizardData) {
      try {
        const parsedData = JSON.parse(savedWizardData);
        if (parsedData.nutrition && parsedData.nutrition.length > 0) {
          setWizardData(prev => ({ ...prev, ...parsedData }));
          console.log('localStorage에서 wizardData 복원:', parsedData);
        }
      } catch (error) {
        console.error('localStorage 데이터 파싱 오류:', error);
      }
    }
  }, []);

  // 백엔드 연결 상태 확인
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('https://foodlaw-production-e1f3.up.railway.app/api/health', { 
          method: 'GET',
          mode: 'no-cors' // CORS 오류 방지
        });
        setBackendConnectionStatus('connected');
      } catch (error) {
        console.log('백엔드 연결 확인 실패:', error);
        setBackendConnectionStatus('disconnected');
      }
    };

    checkBackendConnection();
  }, []);

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

  const handleComplete = () => {
    // 4단계 완료 시 품질관리로 이동
    onComplete?.(wizardData)
  }

  const updateWizardData = useCallback((field: keyof ProductWizardData, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAIAnalyze = async (ingredients: string) => {
    setShowAIResult(true)
    setShowDirectInput(false)
    
    try {
      console.log("AI 분석 시작:", { productName: wizardData.productName, ingredients })
      
      const result = await aiService.analyzeProductType({
        productName: wizardData.productName,
        mainIngredients: ingredients,
      });
      
      console.log("AI 분석 원본 응답:", result);
      
      // 응답 형식 검증 및 처리
      if (result && result.success && result.recommendations && Array.isArray(result.recommendations)) {
        setAIRecommendations(result.recommendations.map((rec: any) => rec.type));
        console.log("AI 분석 성공:", result.recommendations);
      } else if (result && result.recommendations && Array.isArray(result.recommendations)) {
        // success 필드가 없어도 recommendations가 있으면 처리
        setAIRecommendations(result.recommendations.map((rec: any) => rec.type));
        console.log("AI 분석 성공 (success 필드 없음):", result.recommendations);
      } else if (result && result.recommendation && Array.isArray(result.recommendation)) {
        // recommendation 필드로 응답이 온 경우 (자동채우기와 동일한 형식)
        setAIRecommendations(result.recommendation.map((rec: any) => rec.name || rec.type || '알 수 없는 유형'));
        console.log("AI 분석 성공 (recommendation 형식):", result.recommendation);
      } else {
        console.error("AI 분석 응답 형식 오류:", result);
        console.error("응답 구조:", JSON.stringify(result, null, 2));
        setAIRecommendations(["AI 분석 실패: 응답 형식을 확인할 수 없습니다."]);
      }
    } catch (error) {
      console.error("AI Product Type Analysis Error:", error);
      setAIRecommendations(["AI 분석 중 오류가 발생했습니다."]);
    }
  }

  const handleDirectInput = () => {
    setShowDirectInput(true)
    setShowAIResult(false)
    setAIRecommendations([])
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
            <div className="ml-4 text-sm text-muted-foreground">
              {currentStep}/4 단계: {DEFAULT_STEPS[currentStep - 1]?.title || ''}
            </div>
            {/* 백엔드 연결 상태 표시 */}
            <Badge 
              variant={backendConnectionStatus === 'connected' ? 'default' : 'destructive'} 
              className="text-xs ml-2"
            >
              {backendConnectionStatus === 'checking' && '🔍 연결 확인 중...'}
              {backendConnectionStatus === 'connected' && '✅ 백엔드 연결됨'}
              {backendConnectionStatus === 'disconnected' && '❌ 백엔드 연결 안됨'}
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
            <Step1ProductInfo
              productName={wizardData.productName}
              productType={wizardData.productType}
              onProductNameChange={(value) => updateWizardData('productName', value)}
              onProductTypeChange={(value) => updateWizardData('productType', value)}
              onAnalyze={handleAIAnalyze}
              onDirectInput={handleDirectInput}
              showAIResult={showAIResult}
              showDirectInput={showDirectInput}
              aiRecommendations={aiRecommendations}
            />
          )}

          {currentStep === 2 && (
            <Step2Ingredients
              productName={wizardData.productName}
              mainIngredients={wizardData.ingredients.map(ing => `${ing.name}(${ing.ratio.toFixed(1)}%)`).join(', ')}
              productType={wizardData.productType}
              ingredients={wizardData.ingredients}
              onIngredientsChange={(ingredients) => updateWizardData('ingredients', ingredients)}
              onTotalWeightChange={(weight) => updateWizardData('totalWeight', weight)}
            />
          )}

          {currentStep === 3 && (
            <Step3Nutrition
              productName={wizardData.productName}
              mainIngredients={wizardData.ingredients.map(ing => `${ing.name}(${ing.ratio.toFixed(1)}%)`).join(', ')}
              productType={wizardData.productType}
              totalWeight={wizardData.totalWeight}
              ingredients={wizardData.ingredients}
              nutrition={wizardData.nutrition}
              onNutritionChange={(nutrition) => updateWizardData('nutrition', nutrition)}
            />
          )}

          {currentStep === 4 && (
            <Step4Labeling
              productName={wizardData.productName}
              mainIngredients={wizardData.ingredients.map(ing => `${ing.name}(${ing.ratio.toFixed(1)}%)`).join(', ')}
              productType={wizardData.productType}
              totalWeight={wizardData.totalWeight}
              labeling={wizardData.labeling}
              onLabelingChange={(labeling) => updateWizardData('labeling', labeling)}
            />
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
          
          {currentStep === DEFAULT_STEPS.length ? (
            <Button 
              onClick={handleComplete}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              제품품질관리규격화
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={currentStep === DEFAULT_STEPS.length}
              className="flex items-center gap-2"
            >
              다음 단계
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
