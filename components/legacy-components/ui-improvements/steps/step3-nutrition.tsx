"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Database, Bot, Scale, Calculator } from "lucide-react"

interface NutritionItem {
  category: string
  unit: string
  serving: number
  standard: number
  dailyValue: number
}

interface Step3NutritionProps {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  nutrition: NutritionItem[]
  onNutritionChange: (nutrition: NutritionItem[]) => void
}

const DEFAULT_NUTRITION: NutritionItem[] = [
  { category: '열량', unit: 'kcal', serving: 0, standard: 0, dailyValue: 0 },
  { category: '탄수화물', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '단백질', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '지방', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '나트륨', unit: 'mg', serving: 0, standard: 0, dailyValue: 0 },
  { category: '당류', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '포화지방', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '트랜스지방', unit: 'g', serving: 0, standard: 0, dailyValue: 0 },
  { category: '콜레스테롤', unit: 'mg', serving: 0, standard: 0, dailyValue: 0 },
]

export function Step3Nutrition({
  productName,
  mainIngredients,
  productType,
  totalWeight,
  nutrition,
  onNutritionChange
}: Step3NutritionProps) {
  const [localNutrition, setLocalNutrition] = useState<NutritionItem[]>(
    nutrition.length > 0 ? nutrition : DEFAULT_NUTRITION
  )

  const updateNutrition = (index: number, field: keyof NutritionItem, value: number) => {
    const updatedNutrition = localNutrition.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value }
        
        // 1일 기준치 자동 계산 (예시)
        if (field === 'serving') {
          switch (item.category) {
            case '열량':
              updated.dailyValue = value > 0 ? Number(((value / 2000) * 100).toFixed(1)) : 0
              break
            case '탄수화물':
              updated.dailyValue = value > 0 ? Number(((value / 324) * 100).toFixed(1)) : 0
              break
            case '단백질':
              updated.dailyValue = value > 0 ? Number(((value / 55) * 100).toFixed(1)) : 0
              break
            case '지방':
              updated.dailyValue = value > 0 ? Number(((value / 54) * 100).toFixed(1)) : 0
              break
            case '나트륨':
              updated.dailyValue = value > 0 ? Number(((value / 2000) * 100).toFixed(1)) : 0
              break
            default:
              updated.dailyValue = 0
          }
        }
        
        return updated
      }
      return item
    })
    
    setLocalNutrition(updatedNutrition)
    onNutritionChange(updatedNutrition)
  }

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
          <h4 className="text-lg font-semibold">영양성분 정보</h4>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/6 text-center">구분</TableHead>
                  <TableHead className="w-1/6 text-center">단위</TableHead>
                  <TableHead className="w-1/4 text-center">1회 제공량</TableHead>
                  <TableHead className="w-1/4 text-center">영양소 기준치</TableHead>
                  <TableHead className="w-1/6 text-center">1일 기준치(%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localNutrition.map((item, index) => (
                  <TableRow key={item.category}>
                    <TableCell className="text-center font-medium">
                      {item.category}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.unit}
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={item.serving || ''}
                        onChange={(e) => updateNutrition(index, 'serving', Number(e.target.value))}
                        className="text-center border-0 bg-transparent focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={item.standard || ''}
                        onChange={(e) => updateNutrition(index, 'standard', Number(e.target.value))}
                        className="text-center border-0 bg-muted/50 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={item.dailyValue || ''}
                        readOnly
                        className="text-center border-0 bg-muted/50 focus-visible:ring-0 font-medium"
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
              총 {localNutrition.filter(item => item.serving > 0).length}개 영양소 입력됨
            </Badge>
          </div>
        </div>

        {/* 영양성분 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {localNutrition[0]?.serving || 0}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">kcal</div>
              <div className="text-xs text-muted-foreground">열량</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {localNutrition[1]?.serving || 0}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">g</div>
              <div className="text-xs text-muted-foreground">탄수화물</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {localNutrition[2]?.serving || 0}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">g</div>
              <div className="text-xs text-muted-foreground">단백질</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {localNutrition[3]?.serving || 0}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">g</div>
              <div className="text-xs text-muted-foreground">지방</div>
            </CardContent>
          </Card>
        </div>

        {/* 도움말 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 영양성분 입력 가이드</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• 1회 제공량을 입력하면 1일 기준치가 자동으로 계산됩니다.</li>
            <li>• DB 연결을 통해 일반적인 식품의 영양성분을 불러올 수 있습니다.</li>
            <li>• AI 분석으로 재료 기반 영양성분을 추정할 수 있습니다.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
