"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Bot, Scale, Database, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiService } from "@/lib/ai-service"

interface Ingredient {
  id: string
  name: string
  weight: number
  ratio: number
  notes: string
}

interface Step2IngredientsProps {
  productName: string
  mainIngredients: string
  productType: string
  ingredients: Ingredient[]
  onIngredientsChange: (ingredients: Ingredient[]) => void
  onTotalWeightChange: (weight: number) => void
}

export function Step2Ingredients({
  productName,
  mainIngredients,
  productType,
  ingredients,
  onIngredientsChange,
  onTotalWeightChange
}: Step2IngredientsProps) {
  const [localIngredients, setLocalIngredients] = useState<Ingredient[]>(
    ingredients.length > 0 ? ingredients : [
      { id: '1', name: '', weight: 0, ratio: 0, notes: '' }
    ]
  )
  const [isAutofilling, setIsAutofilling] = useState(false)
  const [isAnalyzingLaw, setIsAnalyzingLaw] = useState(false)
  const [lawAnalysisResult, setLawAnalysisResult] = useState<any>(null)
  const [showLawAnalysis, setShowLawAnalysis] = useState(false)

  // 총 중량 및 배합비 계산
  useEffect(() => {
    const totalWeight = localIngredients.reduce((sum, ing) => sum + (ing.weight || 0), 0)
    
    // 배합비 자동 계산
    const updatedIngredients = localIngredients.map(ing => ({
      ...ing,
      ratio: totalWeight > 0 ? Number(((ing.weight / totalWeight) * 100).toFixed(1)) : 0
    }))
    
    setLocalIngredients(updatedIngredients)
    onIngredientsChange(updatedIngredients)
    onTotalWeightChange(totalWeight)
  }, [localIngredients.map(ing => ing.weight).join(',')]) // weight 변경 시만 재계산

  const addRow = () => {
    const newId = (localIngredients.length + 1).toString()
    const newIngredients = [...localIngredients, { 
      id: newId, 
      name: '', 
      weight: 0, 
      ratio: 0, 
      notes: '' 
    }]
    setLocalIngredients(newIngredients)
  }

  const deleteRow = () => {
    if (localIngredients.length > 1) {
      const newIngredients = localIngredients.slice(0, -1)
      setLocalIngredients(newIngredients)
    }
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    const updatedIngredients = localIngredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    )
    setLocalIngredients(updatedIngredients)
  }

  const totalWeight = localIngredients.reduce((sum, ing) => sum + (ing.weight || 0), 0)

  const handleAIAutofill = async () => {
    if (!productName.trim() || !productType.trim()) {
      alert("제품명과 제품 유형을 먼저 입력해주세요.");
      return;
    }

    setIsAutofilling(true);
    
    try {
      console.log("AI 자동채우기 시작:", { productName, productType, totalWeight, mainIngredients });
      
      const result = await aiService.autofillIngredients({
        productName,
        productType,
        totalWeight: totalWeight || 1000, // 기본값 1000g
        mainIngredients: mainIngredients || "정보 없음"
      });
      
      if (result.recommendation && result.recommendation.ingredients) {
        // AI 추천 재료로 테이블 업데이트 (기존 비고 값 유지)
        const aiIngredients = result.recommendation.ingredients.map((ing: any, index: number) => {
          // 기존 재료의 비고 값을 찾아서 유지
          const existingIngredient = localIngredients[index];
          const existingNotes = existingIngredient ? existingIngredient.notes : '';
          
          // 중량과 배합비 문자열에서 숫자만 추출
          const parsedWeight = parseFloat(ing.weight.toString().replace(/[^0-9.]/g, ''));
          const parsedRatio = parseFloat(ing.ratio.toString().replace(/[^0-9.]/g, ''));
          
          return {
            id: (index + 1).toString(),
            name: ing.name,
            weight: isNaN(parsedWeight) ? 0 : parsedWeight,
            ratio: isNaN(parsedRatio) ? 0 : parsedRatio,
            notes: existingNotes // 기존 비고 값만 유지, AI 텍스트 추가하지 않음
          };
        });
        
        setLocalIngredients(aiIngredients);
        console.log("AI 자동채우기 결과:", result.recommendation);
        
        // 부모 컴포넌트에 변경사항 전달
        onIngredientsChange(aiIngredients);
        onTotalWeightChange(aiIngredients.reduce((sum: number, ing: any) => sum + ing.weight, 0));
      } else {
        alert("AI 자동채우기 결과를 처리할 수 없습니다.");
      }
    } catch (error) {
      console.error("AI 자동채우기 오류:", error);
      alert("AI 자동채우기 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleLawAnalysis = async () => {
    if (localIngredients.length === 0 || localIngredients.every(ing => !ing.name.trim())) {
      alert("분석할 재료가 없습니다. 재료를 먼저 입력해주세요.");
      return;
    }

    setIsAnalyzingLaw(true);
    setShowLawAnalysis(true);
    
    try {
      console.log("법령 분석 시작:", localIngredients);
      
      const result = await aiService.analyzeLawIngredients(localIngredients);
      
      setLawAnalysisResult(result);
      console.log("법령 분석 결과:", result);
      
    } catch (error) {
      console.error("법령 분석 오류:", error);
      alert("법령 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzingLaw(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default" className="w-6 h-6 p-0 rounded-full">2</Badge>
          재료 입력
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* 제품 정보 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">제품 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">제품명:</span>
                <span className="font-medium">{productName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">제품유형:</span>
                <span className="font-medium">{productType || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 중량:</span>
                <span className="font-medium">{totalWeight}g</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">주요 성분</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {mainIngredients || '입력된 주요 성분이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 재료 입력 테이블 */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">재료 목록</h4>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/4 text-center">재료명</TableHead>
                  <TableHead className="w-1/4 text-center">중량(g)</TableHead>
                  <TableHead className="w-1/4 text-center">배합비(%)</TableHead>
                  <TableHead className="w-1/4 text-center">비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localIngredients.map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="p-2">
                      <Input
                        type="text"
                        placeholder="재료명"
                        value={ingredient.name}
                        onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                        className="text-center border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        placeholder="중량"
                        value={ingredient.weight || ''}
                        onChange={(e) => updateIngredient(ingredient.id, 'weight', Number(e.target.value))}
                        className="text-center border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        placeholder="배합비"
                        value={ingredient.ratio || ''}
                        readOnly
                        className="text-center border-0 bg-muted/50 focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="text"
                        placeholder="비고"
                        value={ingredient.notes}
                        onChange={(e) => updateIngredient(ingredient.id, 'notes', e.target.value)}
                        className="text-center border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/30">
                  <TableCell className="font-medium text-center">합계</TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value={totalWeight}
                      readOnly
                      className="text-center border-0 bg-muted/50 focus-visible:ring-0 font-medium"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      value="100.0"
                      readOnly
                      className="text-center border-0 bg-muted/50 focus-visible:ring-0 font-medium"
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>

        <Separator />

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={addRow}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="mr-2 w-4 h-4" />
              행 추가
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={deleteRow}
              disabled={localIngredients.length <= 1}
            >
              <Trash2 className="mr-2 w-4 h-4" />
              행 삭제
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleAIAutofill}
              disabled={isAutofilling}
            >
              {isAutofilling ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <Bot className="mr-2 w-4 h-4" />
              )}
              {isAutofilling ? "AI 분석 중..." : "AI 자동채우기"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLawAnalysis} disabled={isAnalyzingLaw}>
              <Scale className="mr-2 w-4 h-4" />
              법령 분석
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              총 {localIngredients.length}개 재료
            </Badge>
            <Badge variant="outline">
              총 중량 {totalWeight}g
            </Badge>
          </div>
        </div>

        {/* 도움말 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 재료 입력 가이드</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• 중량을 입력하면 배합비가 자동으로 계산됩니다.</li>
            <li>• AI 자동채우기로 일반적인 재료 정보를 자동 입력할 수 있습니다.</li>
            <li>• 법령 분석으로 식품 관련 규정을 확인할 수 있습니다.</li>
          </ul>
        </div>

        {/* 법령 분석 결과 */}
        {showLawAnalysis && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">법령 분석 결과</h5>
            {isAnalyzingLaw ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="mr-2 w-6 h-6 animate-spin text-blue-500 dark:text-blue-400" />
                <span className="ml-2 text-lg text-blue-500 dark:text-blue-400">법령 분석 중...</span>
              </div>
            ) : lawAnalysisResult ? (
              <div className="space-y-3">
                {/* 준수 여부 */}
                <div className={`p-3 rounded-md border ${
                  lawAnalysisResult.compliance 
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800'
                }`}>
                  <h6 className={`font-medium mb-1 ${
                    lawAnalysisResult.compliance 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    준수 여부: {lawAnalysisResult.compliance ? '✅ 준수' : '❌ 미준수'}
                  </h6>
                </div>

                {/* 주의사항 */}
                {lawAnalysisResult.issues && lawAnalysisResult.issues.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <h6 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">⚠️ 주의사항</h6>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-200 space-y-1">
                      {lawAnalysisResult.issues.map((issue: string, index: number) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 관련 법령 */}
                {lawAnalysisResult.references && lawAnalysisResult.references.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                    <h6 className="font-medium text-blue-900 dark:text-blue-100 mb-1">📚 관련 법령</h6>
                    <div className="space-y-2">
                      {lawAnalysisResult.references.map((ref: any, index: number) => (
                        <div key={index} className="bg-white dark:bg-blue-800 p-2 rounded border border-blue-200 dark:border-blue-700">
                          <div className="font-medium text-blue-800 dark:text-blue-200 text-sm">{ref.title}</div>
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">{ref.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">법령 분석 결과가 없습니다.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
