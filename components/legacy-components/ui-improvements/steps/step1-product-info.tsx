"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Lightbulb, AlertCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step1ProductInfoProps {
  productName: string
  productType: string
  onProductNameChange: (value: string) => void
  onProductTypeChange: (value: string) => void
  onAnalyze?: (ingredients: string) => void
  onDirectInput?: () => void
  showAIResult?: boolean
  showDirectInput?: boolean
  aiRecommendations?: string[]
}

export function Step1ProductInfo({
  productName,
  productType,
  onProductNameChange,
  onProductTypeChange,
  onAnalyze,
  onDirectInput,
  showAIResult = false,
  showDirectInput = false,
  aiRecommendations = []
}: Step1ProductInfoProps) {
  const [analysisIngredients, setAnalysisIngredients] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isAnalyzeDisabled = !productName.trim() || !analysisIngredients.trim()

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 직접 입력 모드 전환시 검색 입력값 초기화
  useEffect(() => {
    if (showDirectInput) {
      setSearchInput(productType || "")
    }
  }, [showDirectInput, productType])

  const productTypes = [
    { value: "두류가공품", label: "두류가공품" },
    { value: "즉석조리식품", label: "즉석조리식품" },
    { value: "기타가공품", label: "기타가공품" },
    { value: "과자류", label: "과자류" },
    { value: "음료류", label: "음료류" },
    { value: "유제품류", label: "유제품류" },
    { value: "육류가공품", label: "육류가공품" },
    { value: "수산가공품", label: "수산가공품" },
    { value: "면류", label: "면류" },
    { value: "빵류", label: "빵류" },
    { value: "떡류", label: "떡류" },
    { value: "식용유지류", label: "식용유지류" },
    { value: "조미료", label: "조미료" },
    { value: "드레싱류", label: "드레싱류" },
    { value: "김치류", label: "김치류" },
    { value: "젓갈류", label: "젓갈류" },
    { value: "장류", label: "장류" },
    { value: "절임식품", label: "절임식품" },
    { value: "조림식품", label: "조림식품" },
    { value: "주류", label: "주류" },
    { value: "차류", label: "차류" },
    { value: "커피", label: "커피" },
    { value: "건강기능식품", label: "건강기능식품" },
    { value: "특수용도식품", label: "특수용도식품" },
    { value: "기타식품", label: "기타식품" },
  ]

  // 검색 필터링
  const filteredTypes = productTypes.filter(type =>
    type.label.toLowerCase().includes(searchInput.toLowerCase())
  )

  const handleSelectType = (type: string) => {
    onProductTypeChange?.(type)
    setSearchInput(type)
    setShowDropdown(false)
  }

  const handleInputChange = (value: string) => {
    setSearchInput(value)
    if (!showDirectInput) return
    
    // 정확히 일치하는 항목이 있으면 자동 선택
    const exactMatch = productTypes.find(type => 
      type.label.toLowerCase() === value.toLowerCase()
    )
    if (exactMatch) {
      onProductTypeChange?.(exactMatch.value)
    } else {
      onProductTypeChange?.("")
    }
  }

  return (
    <div className="space-y-6">
      {/* 제품 정보 입력 카드 */}
      <Card className="border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="w-6 h-6 p-0 rounded-full">1</Badge>
              제품 정보 입력
            </div>
            <Badge variant="secondary" className="text-xs">1/4 단계</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName">제품명</Label>
              <Input
                id="productName"
                type="text" 
                placeholder="제품명을 입력하세요."
                value={productName}
                onChange={(e) => onProductNameChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">제품 유형</Label>
              {showDirectInput ? (
                <div ref={dropdownRef} className="relative">
                  <div className="relative">
                    <Input
                      id="productType"
                      type="text"
                      placeholder="제품 유형을 검색하거나 선택하세요..."
                      value={searchInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        showDropdown && "rotate-180"
                      )} />
                    </Button>
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-popover border border-border rounded-md shadow-lg">
                      {filteredTypes.length > 0 ? (
                        filteredTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                              productType === type.value && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => handleSelectType(type.value)}
                          >
                            {type.label}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  id="productType"
                  type="text" 
                  placeholder="AI 분석 또는 직접 입력으로 설정됩니다"
                  value={productType}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* AI 분석 섹션 */}
          {!showDirectInput && !showAIResult && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="analysisIngredients">주요 성분 (AI 분석용)</Label>
                <Input
                  id="analysisIngredients"
                  type="text" 
                  placeholder="AI 분석을 위한 주요 성분을 입력하세요 (예: 콩, 밀가루, 설탕)"
                  value={analysisIngredients}
                  onChange={(e) => setAnalysisIngredients(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="button"
                  onClick={() => onAnalyze?.(analysisIngredients)}
                  disabled={isAnalyzeDisabled}
                  className="flex-1 sm:flex-none"
                >
                  <Bot className="mr-2 size-4" />
                  AI 분석 시작
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onDirectInput}
                  className="flex-1 sm:flex-none"
                >
                  직접 입력
                </Button>
              </div>
              
              {isAnalyzeDisabled && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>제품명과 주요 성분을 모두 입력해주세요.</span>
                </div>
              )}
            </div>
          )}

          {/* 입력 가이드 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              제품 정보 입력 가이드
            </h5>
            <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
              <li>• <strong>제품명</strong>: 최종 판매될 제품의 정확한 이름을 입력하세요.</li>
              <li>• <strong>제품 유형</strong>: AI 분석 또는 직접 선택으로 설정할 수 있습니다.</li>
              <li>• <strong>AI 분석</strong>: 주요 성분을 입력하면 적합한 제품 유형을 추천받을 수 있습니다.</li>
              <li>• <strong>직접 입력</strong>: 드롭다운에서 제품 유형을 바로 선택할 수 있습니다.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* AI 분석 결과 카드 */}
      {showAIResult && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="border-b border-green-200 dark:border-green-800">
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Bot className="w-5 h-5" />
              AI 제품 유형 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {aiRecommendations.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-green-700 dark:text-green-300">
                  입력하신 정보를 바탕으로 다음과 같은 제품 유형을 추천합니다:
                </p>
                <div className="space-y-3">
                  {aiRecommendations.map((recommendation, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-white dark:bg-green-950/40 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h6 className="font-medium text-green-800 dark:text-green-200">
                            {recommendation}
                          </h6>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            추천 신뢰도: 높음
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-700 border-green-300 hover:bg-green-100"
                        >
                          선택
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-700 dark:text-green-300 font-medium">
                  AI 분석을 진행하고 있습니다...
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  제품 정보를 분석하여 적합한 유형을 추천해드립니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 입력 상태 요약 */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium">입력 완성도</h5>
              <p className="text-sm text-muted-foreground">
                다음 단계로 진행하기 위한 필수 정보를 확인하세요.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                <div className={`w-3 h-3 rounded-full ${productName ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className={`w-3 h-3 rounded-full ${productType ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <Badge variant="outline">
                {[productName, productType].filter(Boolean).length}/2 필수항목 완성
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
