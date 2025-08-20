"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Database, Bot, Scale, Calculator } from "lucide-react"

interface NutritionRow {
  id: number
  name: string
  ratio: number
  sodium: number
  carbs: number
  sugars: number
  fat: number
  transFat: number
  saturatedFat: number
  cholesterol: number
  protein: number
}

interface Ingredient {
  id: string
  name: string
  weight: number
  ratio: number
  notes: string
}

interface Step3NutritionProps {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  ingredients: Ingredient[]
  nutrition: NutritionRow[]
  onNutritionChange: (nutrition: NutritionRow[]) => void
}

const DEFAULT_NUTRITION: NutritionRow[] = [
  { id: 1, name: '재료1', ratio: 0.50, sodium: 155.00, carbs: 3.74, sugars: 0.91, fat: 2.57, transFat: 0.01, saturatedFat: 0.35, cholesterol: 0.00, protein: 4.84 },
  { id: 2, name: '재료2', ratio: 0, sodium: 1330.00, carbs: 69.00, sugars: 7.00, fat: 3.00, transFat: 0, saturatedFat: 1.00, cholesterol: 0.00, protein: 9.00 },
  { id: 3, name: '재료3', ratio: 0, sodium: 2.00, carbs: 2.35, sugars: 1.70, fat: 0.04, transFat: 0.00, saturatedFat: 0.01, cholesterol: 0.00, protein: 0.95 },
  { id: 4, name: '재료4', ratio: 0.50, sodium: 0.00, carbs: 20.00, sugars: 5.00, fat: 46.00, transFat: 0.00, saturatedFat: 8.50, cholesterol: 0.00, protein: 28.00 },
]

export function Step3Nutrition({
  productName,
  mainIngredients,
  productType,
  totalWeight,
  ingredients,
  nutrition,
  onNutritionChange
}: Step3NutritionProps) {
  // 재료 목록이 있으면 재료를 기반으로 초기화, 없으면 기본값 사용
  const initializeNutrition = () => {
    if (ingredients.length > 0) {
      return ingredients.map((ingredient, index) => ({
        id: index + 1,
        name: ingredient.name || `재료${index + 1}`,
        ratio: ingredient.ratio || 0,
        sodium: 0,
        carbs: 0,
        sugars: 0,
        fat: 0,
        transFat: 0,
        saturatedFat: 0,
        cholesterol: 0,
        protein: 0
      }))
    }
    return nutrition.length > 0 ? nutrition : DEFAULT_NUTRITION
  }

  const [localNutrition, setLocalNutrition] = useState<NutritionRow[]>(initializeNutrition())

  // 재료가 변경될 때마다 영양성분 테이블 업데이트
  useEffect(() => {
    if (ingredients.length > 0) {
      const updatedNutrition = ingredients.map((ingredient, index) => ({
        id: index + 1,
        name: ingredient.name || `재료${index + 1}`,
        ratio: ingredient.ratio || 0,
        sodium: localNutrition[index]?.sodium || 0,
        carbs: localNutrition[index]?.carbs || 0,
        sugars: localNutrition[index]?.sugars || 0,
        fat: localNutrition[index]?.fat || 0,
        transFat: localNutrition[index]?.transFat || 0,
        saturatedFat: localNutrition[index]?.saturatedFat || 0,
        cholesterol: localNutrition[index]?.cholesterol || 0,
        protein: localNutrition[index]?.protein || 0
      }))
      setLocalNutrition(updatedNutrition)
      onNutritionChange(updatedNutrition)
    }
  }, [ingredients])

  const updateNutrition = (index: number, field: keyof NutritionRow, value: number | string) => {
    const updatedNutrition = localNutrition.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value }
        
        // 배합비 100% 제한
        if (field === 'ratio' && typeof value === 'number') {
          const otherRatiosSum = localNutrition
            .filter((_, idx) => idx !== index)
            .reduce((sum, row) => sum + row.ratio, 0)
          
          const maxAllowedRatio = 100 - otherRatiosSum
          if (value > maxAllowedRatio) {
            updated.ratio = Math.max(0, maxAllowedRatio)
          }
        }
        
        return updated
      }
      return item
    })
    
    setLocalNutrition(updatedNutrition)
    onNutritionChange(updatedNutrition)
  }

  const addRow = () => {
    const newRow: NutritionRow = {
      id: Date.now(),
      name: `재료${localNutrition.length + 1}`,
      ratio: 0,
      sodium: 0,
      carbs: 0,
      sugars: 0,
      fat: 0,
      transFat: 0,
      saturatedFat: 0,
      cholesterol: 0,
      protein: 0
    }
    const updated = [...localNutrition, newRow]
    setLocalNutrition(updated)
    onNutritionChange(updated)
  }

  const deleteRow = (index: number) => {
    if (localNutrition.length > 1) {
      const updated = localNutrition.filter((_, i) => i !== index)
      setLocalNutrition(updated)
      onNutritionChange(updated)
    }
  }

  // 100g 당 합산 계산
  const calculate100gTotals = () => {
    const totals = {
      sodium: 0,
      carbs: 0,
      sugars: 0,
      fat: 0,
      transFat: 0,
      saturatedFat: 0,
      cholesterol: 0,
      protein: 0
    }

    localNutrition.forEach(row => {
      if (row.ratio > 0) {
        const ratio = row.ratio / 100
        totals.sodium += row.sodium * ratio
        totals.carbs += row.carbs * ratio
        totals.sugars += row.sugars * ratio
        totals.fat += row.fat * ratio
        totals.transFat += row.transFat * ratio
        totals.saturatedFat += row.saturatedFat * ratio
        totals.cholesterol += row.cholesterol * ratio
        totals.protein += row.protein * ratio
      }
    })

    return totals
  }

  const totals = calculate100gTotals()
  const totalRatio = localNutrition.reduce((sum, row) => sum + row.ratio, 0)
  const isRatioNearLimit = totalRatio > 95
  const isRatioOverLimit = totalRatio > 100

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default" className="w-6 h-6 p-0 rounded-full">3</Badge>
          영양성분 입력
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

        {/* 영양성분 입력 테이블 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">영양성분 정보</h4>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addRow}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                + 행 추가
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-center min-w-[80px]">재료명</TableHead>
                  <TableHead className="text-center min-w-[80px]">배합비(%)</TableHead>
                  <TableHead className="text-center min-w-[100px]">나트륨(mg)</TableHead>
                  <TableHead className="text-center min-w-[100px]">탄수화물(g)</TableHead>
                  <TableHead className="text-center min-w-[80px]">당류(g)</TableHead>
                  <TableHead className="text-center min-w-[80px]">지방(g)</TableHead>
                  <TableHead className="text-center min-w-[100px]">트랜스지방(g)</TableHead>
                  <TableHead className="text-center min-w-[100px]">포화지방(g)</TableHead>
                  <TableHead className="text-center min-w-[100px]">콜레스테롤(mg)</TableHead>
                  <TableHead className="text-center min-w-[80px]">단백질(g)</TableHead>
                  <TableHead className="text-center min-w-[60px]">삭제</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localNutrition.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell className="p-1">
                      <Input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateNutrition(index, 'name', e.target.value)}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.ratio || ''}
                        onChange={(e) => updateNutrition(index, 'ratio', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.sodium || ''}
                        onChange={(e) => updateNutrition(index, 'sodium', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.carbs || ''}
                        onChange={(e) => updateNutrition(index, 'carbs', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.sugars || ''}
                        onChange={(e) => updateNutrition(index, 'sugars', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.fat || ''}
                        onChange={(e) => updateNutrition(index, 'fat', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.transFat || ''}
                        onChange={(e) => updateNutrition(index, 'transFat', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.saturatedFat || ''}
                        onChange={(e) => updateNutrition(index, 'saturatedFat', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.cholesterol || ''}
                        onChange={(e) => updateNutrition(index, 'cholesterol', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.protein || ''}
                        onChange={(e) => updateNutrition(index, 'protein', Number(e.target.value))}
                        className="text-center text-xs border-0 bg-transparent focus-visible:ring-1 h-8"
                      />
                    </TableCell>
                    <TableCell className="p-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(index)}
                        disabled={localNutrition.length <= 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 p-0"
                      >
                        ×
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* 100g 당 합산 행 */}
                <TableRow className={`border-t-2 ${
                  isRatioOverLimit 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200' 
                    : isRatioNearLimit 
                      ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200'
                      : 'bg-green-50 dark:bg-green-950/20 border-green-200'
                }`}>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>
                    제품 100g 당
                  </TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>
                    {totalRatio.toFixed(2)}%
                    {isRatioOverLimit && ' ⚠️'}
                    {isRatioNearLimit && !isRatioOverLimit && ' ⚠️'}
                  </TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.sodium.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.carbs.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.sugars.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.fat.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.transFat.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.saturatedFat.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.cholesterol.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>{totals.protein.toFixed(2)}</TableCell>
                  <TableCell className={`text-center font-bold ${
                    isRatioOverLimit 
                      ? 'text-red-700' 
                      : isRatioNearLimit 
                        ? 'text-yellow-700'
                        : 'text-green-700'
                  }`}>-</TableCell>
                </TableRow>
              </TableBody>
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Database className="mr-2 w-4 h-4" />
              DB 연결
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Bot className="mr-2 w-4 h-4" />
              AI 분석
            </Button>
            <Button variant="outline" size="sm">
              <Scale className="mr-2 w-4 h-4" />
              법령 분석
            </Button>
            <Button variant="outline" size="sm">
              <Calculator className="mr-2 w-4 h-4" />
              자동 계산
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              총 {localNutrition.length}개 제품 입력됨
            </Badge>
            <Badge 
              variant="outline" 
              className={`${
                isRatioOverLimit 
                  ? 'bg-red-50 text-red-700 border-red-300' 
                  : isRatioNearLimit 
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                    : 'bg-green-50 text-green-700 border-green-300'
              }`}
            >
              배합비 합계: {totalRatio.toFixed(2)}%
              {isRatioOverLimit && ' ⚠️'}
              {isRatioNearLimit && !isRatioOverLimit && ' ⚠️'}
            </Badge>
          </div>
        </div>

        {/* 영양성분 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {totals.sodium.toFixed(2)}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">mg</div>
              <div className="text-xs text-muted-foreground">나트륨</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totals.carbs.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">g</div>
              <div className="text-xs text-muted-foreground">탄수화물</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totals.fat.toFixed(2)}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">g</div>
              <div className="text-xs text-muted-foreground">지방</div>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totals.protein.toFixed(2)}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">g</div>
              <div className="text-xs text-muted-foreground">단백질</div>
            </CardContent>
          </Card>
        </div>

        {/* 도움말 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 영양성분 입력 가이드</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• <strong>배합비</strong>를 입력하면 100g 당 영양성분이 자동으로 계산됩니다.</li>
            <li>• <strong>배합비 합계는 100%를 초과할 수 없습니다.</strong> 95% 이상일 때 경고가 표시됩니다.</li>
            <li>• DB 연결을 통해 일반적인 식품의 영양성분을 불러올 수 있습니다.</li>
            <li>• AI 분석으로 재료 기반 영양성분을 추정할 수 있습니다.</li>
            <li>• 행 추가/삭제가 가능하며, 정확한 배합비 입력이 중요합니다.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
