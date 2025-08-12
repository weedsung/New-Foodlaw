"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Bot, Scale, FileText, Eye } from "lucide-react"

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

interface LabelTableRow {
  id: string
  no: number
  ingredient: string
  ratio: string
  weight: string
  foodType: string
  origin: string
  allergy: string
}

interface Step4LabelingProps {
  productName: string
  mainIngredients: string
  productType: string
  totalWeight: number
  labeling: LabelingData
  onLabelingChange: (labeling: LabelingData) => void
}

export function Step4Labeling({
  productName,
  mainIngredients,
  productType,
  totalWeight,
  labeling,
  onLabelingChange
}: Step4LabelingProps) {
  const [localLabeling, setLocalLabeling] = useState<LabelingData>({
    productName: productName || '',
    productType: productType || '',
    ingredients: mainIngredients || '',
    amount: `${totalWeight}g`,
    expiry: '',
    packaging: '',
    reportNo: '',
    company: '',
    returnPolicy: '',
    storage: '',
    allergy: '',
    customerService: '',
    additionalInfo: '',
    ...labeling
  })

  const [labelTableRows, setLabelTableRows] = useState<LabelTableRow[]>([
    { id: '1', no: 1, ingredient: '', ratio: '', weight: '', foodType: '', origin: '', allergy: '' }
  ])

  const updateLabeling = (field: keyof LabelingData, value: string) => {
    const updated = { ...localLabeling, [field]: value }
    setLocalLabeling(updated)
    onLabelingChange(updated)
  }

  const addLabelRow = () => {
    const newRow: LabelTableRow = {
      id: (labelTableRows.length + 1).toString(),
      no: labelTableRows.length + 1,
      ingredient: '',
      ratio: '',
      weight: '',
      foodType: '',
      origin: '',
      allergy: ''
    }
    setLabelTableRows([...labelTableRows, newRow])
  }

  const deleteLabelRow = () => {
    if (labelTableRows.length > 1) {
      setLabelTableRows(labelTableRows.slice(0, -1))
    }
  }

  const updateLabelRow = (id: string, field: keyof LabelTableRow, value: string | number) => {
    setLabelTableRows(rows =>
      rows.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default" className="w-6 h-6 p-0 rounded-full">4</Badge>
          표시사항
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              표시사항 미리보기
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              표시사항 작성
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-6">
            {/* 표시사항 미리보기 */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">제품 표시사항 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="text-center font-bold" colSpan={4}>
                          표시사항
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium w-32">제품명</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.productName}
                            onChange={(e) => updateLabeling('productName', e.target.value)}
                            placeholder="제품명"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium w-32">식품유형</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.productType}
                            onChange={(e) => updateLabeling('productType', e.target.value)}
                            placeholder="제품유형"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">원료명</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.ingredients}
                            onChange={(e) => updateLabeling('ingredients', e.target.value)}
                            placeholder="예: 현미(국산)74%, 소면(미국산)21% 등"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium">내용량</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.amount}
                            onChange={(e) => updateLabeling('amount', e.target.value)}
                            placeholder="예: 912g"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">유통기한</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.expiry}
                            onChange={(e) => updateLabeling('expiry', e.target.value)}
                            placeholder="예: 제조일로부터 20일"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium">포장재질</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.packaging}
                            onChange={(e) => updateLabeling('packaging', e.target.value)}
                            placeholder="예: 폴리에틸렌(PE)"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">품목보고번호</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.reportNo}
                            onChange={(e) => updateLabeling('reportNo', e.target.value)}
                            placeholder="예: 20230000001"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium">업소명 및 소재지</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.company}
                            onChange={(e) => updateLabeling('company', e.target.value)}
                            placeholder="예: (주)푸드로/서울시 강남구"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">반품 및 교환</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.returnPolicy}
                            onChange={(e) => updateLabeling('returnPolicy', e.target.value)}
                            placeholder="예: 구입처 및 고객센터"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium">보관방법</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.storage}
                            onChange={(e) => updateLabeling('storage', e.target.value)}
                            placeholder="예: 냉장(0~10℃) 보관"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">알레르기</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.allergy}
                            onChange={(e) => updateLabeling('allergy', e.target.value)}
                            placeholder="예: 대두, 밀, 땅콩 함유"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                        <TableCell className="font-medium">고객센터</TableCell>
                        <TableCell className="p-2">
                          <Input
                            value={localLabeling.customerService}
                            onChange={(e) => updateLabeling('customerService', e.target.value)}
                            placeholder="예: 02-1234-5678"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">추가사항</TableCell>
                        <TableCell className="p-2" colSpan={3}>
                          <Input
                            value={localLabeling.additionalInfo}
                            onChange={(e) => updateLabeling('additionalInfo', e.target.value)}
                            placeholder="예: 부정·불량식품 신고는 국번없이 1399"
                            className="border-0 bg-transparent focus-visible:ring-1"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* 표시사항 작성 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">표시사항 상세 작성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="text-center">번호</TableHead>
                        <TableHead className="text-center">재료명</TableHead>
                        <TableHead className="text-center">배합비(%)</TableHead>
                        <TableHead className="text-center">중량(g)</TableHead>
                        <TableHead className="text-center">식품유형</TableHead>
                        <TableHead className="text-center">원산지</TableHead>
                        <TableHead className="text-center">알레르기</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labelTableRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-center font-medium">
                            {row.no}
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.ingredient}
                              onChange={(e) => updateLabelRow(row.id, 'ingredient', e.target.value)}
                              placeholder="재료명"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.ratio}
                              onChange={(e) => updateLabelRow(row.id, 'ratio', e.target.value)}
                              placeholder="배합비"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.weight}
                              onChange={(e) => updateLabelRow(row.id, 'weight', e.target.value)}
                              placeholder="중량"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.foodType}
                              onChange={(e) => updateLabelRow(row.id, 'foodType', e.target.value)}
                              placeholder="식품유형"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.origin}
                              onChange={(e) => updateLabelRow(row.id, 'origin', e.target.value)}
                              placeholder="원산지"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={row.allergy}
                              onChange={(e) => updateLabelRow(row.id, 'allergy', e.target.value)}
                              placeholder="알레르기"
                              className="border-0 bg-transparent focus-visible:ring-1"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                {/* 액션 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={addLabelRow}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      행 추가
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={deleteLabelRow}
                      disabled={labelTableRows.length <= 1}
                    >
                      <Trash2 className="mr-2 w-4 h-4" />
                      행 삭제
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Bot className="mr-2 w-4 h-4" />
                      AI 식품유형 분석
                    </Button>
                    <Button variant="outline" size="sm">
                      <Scale className="mr-2 w-4 h-4" />
                      법령 분석
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 표시사항 완성도 표시 */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-blue-900 dark:text-blue-100">표시사항 완성도</h5>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  필수 항목이 모두 입력되었는지 확인하세요.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-1">
                  {[
                    localLabeling.productName,
                    localLabeling.productType,
                    localLabeling.ingredients,
                    localLabeling.amount,
                    localLabeling.company
                  ].map((field, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        field ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline">
                  {[
                    localLabeling.productName,
                    localLabeling.productType,
                    localLabeling.ingredients,
                    localLabeling.amount,
                    localLabeling.company
                  ].filter(Boolean).length}/5 필수항목 완성
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 도움말 */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 표시사항 작성 가이드</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <li>• 제품명, 식품유형, 원료명, 내용량, 업소명은 필수 입력 항목입니다.</li>
            <li>• AI 식품유형 분석으로 재료별 식품유형을 자동 분류할 수 있습니다.</li>
            <li>• 법령 분석으로 표시사항 규정 준수 여부를 확인할 수 있습니다.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
