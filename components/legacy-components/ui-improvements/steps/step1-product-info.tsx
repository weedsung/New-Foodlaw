"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bot, Lightbulb, AlertCircle } from "lucide-react"

interface Step1ProductInfoProps {
  productName: string
  mainIngredients: string
  onProductNameChange: (value: string) => void
  onMainIngredientsChange: (value: string) => void
  onAnalyze?: () => void
  showAIResult?: boolean
  aiRecommendations?: string[]
}

export function Step1ProductInfo({
  productName,
  mainIngredients,
  onProductNameChange,
  onMainIngredientsChange,
  onAnalyze,
  showAIResult = false,
  aiRecommendations = []
}: Step1ProductInfoProps) {
  const isAnalyzeDisabled = !productName.trim() || !mainIngredients.trim()

  return (
    <div className="space-y-6">
      {/* 제품 정보 입력 카드 */}
      <Card className="border-primary/20">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className="w-6 h-6 p-0 rounded-full">1</Badge>
            제품 정보 입력
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
              <Label htmlFor="mainIngredients">주요 성분</Label>
              <Input
                id="mainIngredients"
                type="text" 
                placeholder="주요 성분을 입력하세요."
                value={mainIngredients}
                onChange={(e) => onMainIngredientsChange(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="button"
              onClick={onAnalyze}
              disabled={isAnalyzeDisabled}
              className="flex-1 sm:flex-none"
            >
              <Bot className="mr-2 size-4" />
              AI 분석 시작
            </Button>
            
            {isAnalyzeDisabled && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>제품명과 주요 성분을 모두 입력해주세요.</span>
              </div>
            )}
          </div>

          {/* 입력 가이드 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              제품 정보 입력 가이드
            </h5>
            <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
              <li>• <strong>제품명</strong>: 최종 판매될 제품의 정확한 이름을 입력하세요.</li>
              <li>• <strong>주요 성분</strong>: 제품의 핵심 재료나 특징을 간단히 입력하세요.</li>
              <li>• AI 분석을 통해 제품 유형과 카테고리를 자동으로 추천받을 수 있습니다.</li>
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
                <div className={`w-3 h-3 rounded-full ${mainIngredients ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <Badge variant="outline">
                {[productName, mainIngredients].filter(Boolean).length}/2 필수항목 완성
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
