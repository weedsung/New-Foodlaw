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

interface NutritionItem {
  category: string
  unit: string
  serving: number
  standard: number
  dailyValue: number
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
  mainIngredients: string
  productType: string
  totalWeight: number
  ingredients: Ingredient[]
  nutrition: NutritionItem[]
  labeling: LabelingData
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
    },
    ...initialData
  })

  const [showAIResult, setShowAIResult] = useState(false)
  const [aiRecommendations, setAIRecommendations] = useState<string[]>([])

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

  const handleAIAnalyze = () => {
    setShowAIResult(true)
    // 실제 환경에서는 AI API 호출
    setTimeout(() => {
      setAIRecommendations([
        "두류가공품",
        "즉석조리식품",
        "기타가공품"
      ])
    }, 1500)
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
            <Step1ProductInfo
              productName={wizardData.productName}
              mainIngredients={wizardData.mainIngredients}
              onProductNameChange={(value) => updateWizardData('productName', value)}
              onMainIngredientsChange={(value) => updateWizardData('mainIngredients', value)}
              onAnalyze={handleAIAnalyze}
              showAIResult={showAIResult}
              aiRecommendations={aiRecommendations}
            />
          )}

          {currentStep === 2 && (
            <Step2Ingredients
              productName={wizardData.productName}
              mainIngredients={wizardData.mainIngredients}
              productType={wizardData.productType}
              ingredients={wizardData.ingredients}
              onIngredientsChange={(ingredients) => updateWizardData('ingredients', ingredients)}
              onTotalWeightChange={(weight) => updateWizardData('totalWeight', weight)}
            />
          )}

          {currentStep === 3 && (
            <Step3Nutrition
              productName={wizardData.productName}
              mainIngredients={wizardData.mainIngredients}
              productType={wizardData.productType}
              totalWeight={wizardData.totalWeight}
              nutrition={wizardData.nutrition}
              onNutritionChange={(nutrition) => updateWizardData('nutrition', nutrition)}
            />
          )}

          {currentStep === 4 && (
            <Step4Labeling
              productName={wizardData.productName}
              mainIngredients={wizardData.mainIngredients}
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
