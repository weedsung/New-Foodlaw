"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Bot, Scale, Database } from "lucide-react"
import { cn } from "@/lib/utils"

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
            >
              <Bot className="mr-2 w-4 h-4" />
              AI 자동채우기
            </Button>
            <Button variant="outline" size="sm">
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
      </CardContent>
    </Card>
  )
}
