"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppSidebar } from "@/components/app-sidebar"
import { QuickActions } from "@/components/quick-actions"
import { DetailedStats } from "@/components/detailed-stats"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Plus,
  Search,
  Bell,
  Download,
  Trash2,
  Brain,
  Scale,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Settings,
  Edit,
  Save,
  FileDown,
  RefreshCw,
} from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { calculations } from "@/lib/calculations"
import { validators } from "@/lib/validators"
import { aiService } from "@/lib/ai-service"
import { pdfGenerator } from "@/lib/pdf-generator"
import { exportService } from "@/lib/export-service"
import { storage } from "@/lib/storage"
import { SettingsPage } from "@/components/settings-page"
import { useSettings } from "@/hooks/use-settings"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { ProductWizardShadcn } from "@/components/legacy-components/ui-improvements/product-wizard-shadcn"

interface BlendingData {
  id: number
  ingredient: string
  percentage: number
  weight: number
}

interface SpecData {
  id: number
  category: string
  item: string
  standard: string
  management: string
}

const SECTIONS = {
  DASHBOARD: "dashboard",
  STANDARDS: "standards",
  RESULT: "result",
  LAW_UPDATES: "lawUpdates",
  LAW_DETAILS: "lawDetails",
  SETTINGS: "settings", // PROFILE에서 변경
  PRODUCT_WIZARD: "product-wizard", // 제품 등록 마법사
  PRODUCT_WIZARD_STEP1: "product-wizard-step1", // 제품 정보
  PRODUCT_WIZARD_STEP2: "product-wizard-step2", // 재료 입력
  PRODUCT_WIZARD_STEP3: "product-wizard-step3", // 영양성분 입력
  PRODUCT_WIZARD_STEP4: "product-wizard-step4", // 표시사항 입력
}

export default function FoodLawSystem() {
  const { products, loading, addProduct, updateProduct, deleteProduct, searchProducts, filterProducts, getStatistics } =
    useProducts()

  const [currentSection, setCurrentSection] = useState(SECTIONS.DASHBOARD)
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [blendingData, setBlendingData] = useState<BlendingData[]>([
    { id: 1, ingredient: "콩국", percentage: 74.1, weight: 700 },
    { id: 2, ingredient: "소면", percentage: 21.2, weight: 200 },
    { id: 3, ingredient: "기타", percentage: 4.7, weight: 100 },
  ])

  const [productSpecData, setProductSpecData] = useState<SpecData[]>([
    { id: 1, category: "미생물", item: "대장균군", standard: "음성", management: "음성 확인" },
    { id: 2, category: "미생물", item: "살모넬라", standard: "음성", management: "음성 확인" },
    { id: 3, category: "화학", item: "나트륨", standard: "≤ 800mg/100g", management: "≤ 750mg/100g" },
  ])

  const [rawSpecData, setRawSpecData] = useState<SpecData[]>([
    { id: 1, category: "품질", item: "수분", standard: "≤ 14%", management: "≤ 12%" },
    { id: 2, category: "품질", item: "단백질", standard: "≥ 35%", management: "≥ 37%" },
    { id: 3, category: "안전", item: "아플라톡신", standard: "≤ 15㎍/kg", management: "≤ 10㎍/kg" },
  ])

  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  const showSection = (sectionId: string) => {
    if (sectionId === "new-product") {
      // 새 제품 등록 → 제품 등록 마법사로 리디렉션
      setCurrentSection(SECTIONS.PRODUCT_WIZARD)
      return
    }
    setCurrentSection(sectionId)
  }

  const addBlendingRow = () => {
    const newId = Math.max(...blendingData.map((item) => item.id)) + 1
    setBlendingData([...blendingData, { id: newId, ingredient: "", percentage: 0, weight: 0 }])
  }

  const deleteBlendingRow = (id: number) => {
    setBlendingData(blendingData.filter((item) => item.id !== id))
  }

  const updateBlendingData = (id: number, field: keyof BlendingData, value: string | number) => {
    setBlendingData(blendingData.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addSpecRow = (type: "product" | "raw") => {
    const data = type === "product" ? productSpecData : rawSpecData
    const setData = type === "product" ? setProductSpecData : setRawSpecData

    const newId = Math.max(...data.map((item) => item.id)) + 1
    setData([...data, { id: newId, category: "", item: "", standard: "", management: "" }])
  }

  const deleteSpecRow = (id: number, type: "product" | "raw") => {
    const data = type === "product" ? productSpecData : rawSpecData
    const setData = type === "product" ? setProductSpecData : setRawSpecData

    setData(data.filter((item) => item.id !== id))
  }

  const updateSpecData = (id: number, field: keyof SpecData, value: string, type: "product" | "raw") => {
    const data = type === "product" ? productSpecData : rawSpecData
    const setData = type === "product" ? setProductSpecData : setRawSpecData

    setData(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const validateCurrentData = () => {
    const blendingValidation = validators.validateBlending(blendingData)
    const errors = [...blendingValidation.errors]

    productSpecData.forEach((spec, index) => {
      const specValidation = validators.validateSpec(spec)
      if (!specValidation.isValid) {
        errors.push(`제품규격 ${index + 1}행: ${specValidation.errors.join(", ")}`)
      }
    })

    rawSpecData.forEach((spec, index) => {
      const specValidation = validators.validateSpec(spec)
      if (!specValidation.isValid) {
        errors.push(`원료규격 ${index + 1}행: ${specValidation.errors.join(", ")}`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const analyzeStandardsAI = async (tableType: string) => {
    if (!validateCurrentData()) {
      return
    }

    setIsAnalyzing(true)
    try {
      const productData = {
        ingredients: blendingData,
        productSpecs: productSpecData,
        rawSpecs: rawSpecData,
        type: tableType,
      }

      const result = await aiService.analyzeProduct(productData)
      setAnalysisResults(result)

      // 분석 결과 저장
      const analysisHistory = storage.getAnalysisResults()
      analysisHistory.push({
        ...result,
        productData,
        timestamp: new Date().toISOString(),
      })
      storage.saveAnalysisResults(analysisHistory)
    } catch (error) {
      setValidationErrors(["AI 분석 중 오류가 발생했습니다."])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeStandardsLaw = async (tableType: string) => {
    if (!validateCurrentData()) {
      return
    }

    try {
      const productData = {
        ingredients: blendingData,
        productSpecs: productSpecData,
        rawSpecs: rawSpecData,
        type: tableType,
      }

      const result = await aiService.analyzeLaw(productData)
      // 법령 분석 결과 처리
      console.log("법령 분석 결과:", result)
    } catch (error) {
      setValidationErrors(["법령 분석 중 오류가 발생했습니다."])
    }
  }

  const saveCurrentProduct = async () => {
    if (!validateCurrentData()) {
      return
    }

    try {
      const productData = {
        name: currentProduct?.name || "새 제품",
        ingredients: blendingData,
        productSpecs: productSpecData,
        rawSpecs: rawSpecData,
        complianceRate: calculations.calculateComplianceRate([...productSpecData, ...rawSpecData]),
      }

      if (currentProduct) {
        updateProduct(currentProduct.id, productData)
      } else {
        addProduct(productData)
      }

      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "success",
          message: "제품 데이터가 저장되었습니다.",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setValidationErrors(["저장 중 오류가 발생했습니다."])
    }
  }

  const exportData = (format: "csv" | "json") => {
    const data = {
      ingredients: blendingData,
      productSpecs: productSpecData,
      rawSpecs: rawSpecData,
      analysisResults,
    }

    if (format === "csv") {
      exportService.exportToCSV(blendingData, "배합비_데이터")
    } else {
      exportService.exportToJSON(data, "제품_전체_데이터")
    }
  }

  const generatePDFReport = async () => {
    try {
      const reportData = {
        productName: currentProduct?.name || "제품",
        complianceRate: calculations.calculateComplianceRate([...productSpecData, ...rawSpecData]),
        recommendations: analysisResults?.recommendations || [],
        laws: analysisResults?.laws || [],
        ingredients: blendingData,
        productSpecs: productSpecData,
        rawSpecs: rawSpecData,
      }

      await pdfGenerator.generateAnalysisReport(reportData)

      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "success",
          message: "PDF 보고서가 생성되었습니다.",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setValidationErrors(["PDF 생성 중 오류가 발생했습니다."])
    }
  }

  const getTotalPercentage = () => {
    return calculations.calculateTotalPercentage(blendingData)
  }

  const getFilteredProducts = () => {
    let filtered = products

    if (searchQuery) {
      filtered = searchProducts(searchQuery)
    }

    if (statusFilter !== "all") {
      filtered = filterProducts({ status: statusFilter })
    }

    return filtered
  }

  const statistics = getStatistics()
  const { settings } = useSettings()

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Enhanced Stats */}
      <DetailedStats />

      {/* Recent Works - Enhanced with Real Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>최근 작업한 제품</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="제품 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="review_needed">검토필요</SelectItem>
                    <SelectItem value="analyzing">분석중</SelectItem>
                    <SelectItem value="draft">작성중</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => showSection("new-product")} size="sm">
                <Plus className="h-4 w-4 mr-2" />새 제품
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              로딩 중...
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredProducts().map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {product.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge
                          variant={
                            product.status === "completed"
                              ? "default"
                              : product.status === "review_needed"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {product.status === "completed"
                            ? "분석 완료"
                            : product.status === "review_needed"
                              ? "검토 필요"
                              : product.status === "analyzing"
                                ? "분석 중"
                                : "작성 중"}
                        </Badge>
                        {product.complianceRate && <span>법규 준수율: {product.complianceRate}%</span>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>담당: {product.assignee}</span>
                        <span>수정: {new Date(product.lastModified).toLocaleString("ko-KR")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentProduct(product)
                        setBlendingData(product.ingredients || [])
                        setProductSpecData(product.productSpecs || [])
                        setRawSpecData(product.rawSpecs || [])
                        showSection(SECTIONS.STANDARDS)
                      }}
                      className="bg-transparent"
                    >
                      보기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product)
                        // TODO: 제품 수정 페이지로 이동하는 로직 추가
                        console.log("제품 수정 클릭됨:", product.name)
                      }}
                      className="bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                      className="bg-transparent text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {getFilteredProducts().length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery || statusFilter !== "all" ? "검색 결과가 없습니다." : "등록된 제품이 없습니다."}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid - QuickActions를 아래로 이동 */}
      <div className="space-y-6">
        <QuickActions />
      </div>
    </div>
  )

  const renderStandards = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">제품품질관리규격화</h2>
          <p className="text-gray-600">제품의 배합비, 제품규격, 원료규격을 관리합니다</p>
          {currentProduct && <p className="text-sm text-muted-foreground mt-1">현재 편집 중: {currentProduct.name}</p>}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => showSection(SECTIONS.DASHBOARD)}>
            홈으로
          </Button>
          <Button onClick={() => exportData("csv")} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            CSV 내보내기
          </Button>
          <Button onClick={() => exportData("json")} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            JSON 내보내기
          </Button>
          <Button onClick={saveCurrentProduct}>
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Product Summary */}
      <Card>
        <CardHeader>
          <CardTitle>제품 정보 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">기본 정보</h4>
              <div className="space-y-1 text-sm">
                <div>제품명: {currentProduct?.name || "새 제품"}</div>
                <div>제품유형: {currentProduct?.category || "미지정"}</div>
                <div>총 중량: {blendingData.reduce((sum, item) => sum + item.weight, 0)}g</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">배합비 현황</h4>
              <div className="space-y-1 text-sm">
                <div>총 원료 수: {blendingData.length}개</div>
                <div>배합비 합계: {getTotalPercentage().toFixed(1)}%</div>
                <div className={getTotalPercentage() === 100 ? "text-green-600" : "text-red-600"}>
                  상태: {getTotalPercentage() === 100 ? "정상" : "조정 필요"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">규격 현황</h4>
              <div className="space-y-1 text-sm">
                <div>제품규격: {productSpecData.length}개</div>
                <div>원료규격: {rawSpecData.length}개</div>
                <div>예상 준수율: {calculations.calculateComplianceRate([...productSpecData, ...rawSpecData])}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="blending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blending">배합비</TabsTrigger>
          <TabsTrigger value="product">제품규격</TabsTrigger>
          <TabsTrigger value="raw">원료규격</TabsTrigger>
        </TabsList>

        {/* Blending Table */}
        <TabsContent value="blending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>배합비 관리</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">합계:</span>
                  <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                    {getTotalPercentage().toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={addBlendingRow} size="sm">
                    <Plus className="w-4 h-4 mr-2" />행 추가
                  </Button>
                  <Button
                    onClick={() => analyzeStandardsAI("blending")}
                    size="sm"
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "분석 중..." : "AI 분석"}
                  </Button>
                  <Button onClick={() => analyzeStandardsLaw("blending")} size="sm" variant="outline">
                    <Scale className="w-4 h-4 mr-2" />
                    법령 분석
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>원료명</TableHead>
                      <TableHead>배합비 (%)</TableHead>
                      <TableHead>중량 (g)</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blendingData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.ingredient}
                            onChange={(e) => updateBlendingData(item.id, "ingredient", e.target.value)}
                            placeholder="원료명 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.percentage}
                            onChange={(e) => updateBlendingData(item.id, "percentage", Number(e.target.value))}
                            placeholder="0.0"
                            step="0.1"
                            min="0"
                            max="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateBlendingData(item.id, "weight", Number(e.target.value))}
                            placeholder="0"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBlendingRow(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {getTotalPercentage() !== 100 && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      배합비 합계가 100%가 아닙니다. 현재: {getTotalPercentage().toFixed(1)}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Spec Table */}
        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>제품규격 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={() => addSpecRow("product")} size="sm">
                    <Plus className="w-4 h-4 mr-2" />행 추가
                  </Button>
                  <Button
                    onClick={() => analyzeStandardsAI("product")}
                    size="sm"
                    variant="outline"
                    disabled={isAnalyzing}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "분석 중..." : "AI 분석"}
                  </Button>
                  <Button onClick={() => analyzeStandardsLaw("product")} size="sm" variant="outline">
                    <Scale className="w-4 h-4 mr-2" />
                    법령 분석
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>분류</TableHead>
                      <TableHead>항목</TableHead>
                      <TableHead>기준</TableHead>
                      <TableHead>관리규격</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productSpecData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.category}
                            onChange={(e) => updateSpecData(item.id, "category", e.target.value, "product")}
                            placeholder="분류 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.item}
                            onChange={(e) => updateSpecData(item.id, "item", e.target.value, "product")}
                            placeholder="항목 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.standard}
                            onChange={(e) => updateSpecData(item.id, "standard", e.target.value, "product")}
                            placeholder="기준 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.management}
                            onChange={(e) => updateSpecData(item.id, "management", e.target.value, "product")}
                            placeholder="관리규격 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSpecRow(item.id, "product")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Material Spec Table */}
        <TabsContent value="raw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>원료규격 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={() => addSpecRow("raw")} size="sm">
                    <Plus className="w-4 h-4 mr-2" />행 추가
                  </Button>
                  <Button onClick={() => analyzeStandardsAI("raw")} size="sm" variant="outline" disabled={isAnalyzing}>
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "분석 중..." : "AI 분석"}
                  </Button>
                  <Button onClick={() => analyzeStandardsLaw("raw")} size="sm" variant="outline">
                    <Scale className="w-4 h-4 mr-2" />
                    법령 분석
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>분류</TableHead>
                      <TableHead>항목</TableHead>
                      <TableHead>기준</TableHead>
                      <TableHead>관리규격</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawSpecData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.category}
                            onChange={(e) => updateSpecData(item.id, "category", e.target.value, "raw")}
                            placeholder="분류 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.item}
                            onChange={(e) => updateSpecData(item.id, "item", e.target.value, "raw")}
                            placeholder="항목 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.standard}
                            onChange={(e) => updateSpecData(item.id, "standard", e.target.value, "raw")}
                            placeholder="기준 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.management}
                            onChange={(e) => updateSpecData(item.id, "management", e.target.value, "raw")}
                            placeholder="관리규격 입력"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSpecRow(item.id, "raw")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span>AI 분석 중...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI 분석 결과</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span>법규 준수율:</span>
                <Badge
                  className={
                    analysisResults.compliance >= 90
                      ? "bg-green-600"
                      : analysisResults.compliance >= 80
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }
                >
                  {analysisResults.compliance}%
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    analysisResults.riskLevel === "low"
                      ? "text-green-600"
                      : analysisResults.riskLevel === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {analysisResults.riskLevel === "low"
                    ? "낮은 위험"
                    : analysisResults.riskLevel === "medium"
                      ? "중간 위험"
                      : "높은 위험"}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI 권고사항:</h4>
                <ul className="space-y-1">
                  {analysisResults.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{analysisResults.details}</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => showSection(SECTIONS.RESULT)} className="flex-1">
                  상세 결과 보기
                </Button>
                <Button onClick={generatePDFReport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 생성
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => showSection(SECTIONS.DASHBOARD)}>
          홈으로
        </Button>
        <Button onClick={() => showSection(SECTIONS.RESULT)}>결과 확인</Button>
      </div>
    </div>
  )

  const renderResult = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">법규 준수 분석 결과</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => showSection(SECTIONS.STANDARDS)}>
            수정하기
          </Button>
          <Button onClick={generatePDFReport}>
            <Download className="w-4 h-4 mr-2" />
            PDF 다운로드
          </Button>
        </div>
      </div>

      {/* Real-time Compliance Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>법규 준수 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Calculate real compliance from current data */}
            {[...productSpecData, ...rawSpecData].map((spec, index) => {
              const isCompliant =
                spec.standard === spec.management ||
                (spec.standard.includes("≤") &&
                  spec.management.includes("≤") &&
                  Number.parseFloat(spec.management.replace(/[^0-9.]/g, "")) <=
                    Number.parseFloat(spec.standard.replace(/[^0-9.]/g, ""))) ||
                (spec.standard.includes("≥") &&
                  spec.management.includes("≥") &&
                  Number.parseFloat(spec.management.replace(/[^0-9.]/g, "")) >=
                    Number.parseFloat(spec.standard.replace(/[^0-9.]/g, "")))

              return (
                <div key={index} className="flex items-center space-x-4">
                  <span className="w-20 text-sm font-medium">{spec.item}:</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>기준: {spec.standard}</span>
                      <span>관리: {spec.management}</span>
                    </div>
                    <div className={`h-2 rounded-full ${isCompliant ? "bg-green-500" : "bg-red-500"}`}></div>
                  </div>
                  <span className="text-sm text-gray-600 min-w-0 flex items-center space-x-2">
                    {isCompliant ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{isCompliant ? "준수" : "미준수"}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Law Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>적용 법령 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">식품위생법 제7조</h4>
                  <p className="text-sm text-gray-600">식품 등의 표시기준에 관한 규정</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => showSection(SECTIONS.LAW_DETAILS)}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">식품공전 제2편</h4>
                  <p className="text-sm text-gray-600">식품일반에 대한 공통기준 및 규격</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => showSection(SECTIONS.LAW_DETAILS)}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>개선 권고사항</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResults?.recommendations?.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">권고사항 {index + 1}</h4>
                  <p className="text-sm text-gray-600">{recommendation}</p>
                </div>
              </div>
            )) || <div className="text-center py-4 text-muted-foreground">분석을 실행하면 권고사항이 표시됩니다.</div>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Button onClick={() => showSection(SECTIONS.DASHBOARD)}>홈으로 돌아가기</Button>
      </div>
    </div>
  )

  const renderLawUpdates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">법령 업데이트</h2>
        <Button variant="outline" onClick={() => showSection(SECTIONS.DASHBOARD)}>
          홈으로
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 업데이트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">식품공전 개정 (2024.12.15)</h4>
              <p className="text-sm text-gray-600">영양성분 표시 기준 변경</p>
              <span className="text-xs text-gray-500">2024-12-15</span>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">식품위생법 시행규칙 개정 (2024.12.01)</h4>
              <p className="text-sm text-gray-600">표시사항 기재 방법 개선</p>
              <span className="text-xs text-gray-500">2024-12-01</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => <SettingsPage onClose={() => showSection(SECTIONS.DASHBOARD)} />

  const renderProductWizard = (initialStep = 1) => {
    const handleSave = (data: any) => {
      console.log("제품 마법사에서 저장된 데이터:", data)
      alert("제품 정보가 저장되었습니다!")
    }

    const handleCancel = () => {
      console.log("제품 마법사 취소됨")
      showSection(SECTIONS.DASHBOARD)
    }

    const handleComplete = (data: any) => {
      console.log("식품개발 4단계 완료! 제품품질관리규격화로 이동:", data)
      
      // 1. 제품 데이터 저장
      const productData = {
        ...data,
        id: Date.now(),
        name: data.productName || "새 제품",
        category: data.productType || "미분류",
        status: 'draft',
        assignee: '개발자',
        lastModified: new Date().toISOString(),
        complianceRate: 0 // 품질관리에서 설정될 예정
      }
      
      addProduct(productData)
      setCurrentProduct(productData)
      
      // 2. 마법사 데이터를 품질관리 섹션에서 사용할 수 있도록 설정
      // 배합비 데이터 매핑
      if (data.ingredients && data.ingredients.length > 0) {
        setBlendingData(data.ingredients.map((ing: any, index: number) => ({
          id: index + 1,
          ingredient: ing.name || `재료${index + 1}`,
          percentage: ing.ratio || 0,
          weight: ing.weight || 0
        })))
      }
      
      // 3. 제품품질관리규격화 섹션으로 이동
      showSection(SECTIONS.STANDARDS)
      
      // 4. 성공 메시지
      setNotifications((prev: any) => [
        ...prev,
        {
          id: Date.now(),
          type: "success",
          message: `식품개발 4단계 완료! "${data.productName || '새 제품'}" 제품품질관리규격화 단계로 이동했습니다.`,
          timestamp: new Date(),
        },
      ])
    }

    return (
      <ProductWizardShadcn
        onSave={handleSave}
        onCancel={handleCancel}
        onComplete={handleComplete}
        initialStep={initialStep}
        initialData={{
          productName: "",
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
          }
        }}
      />
    )
  }

  const renderLawDetails = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">식품공전</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => showSection(SECTIONS.DASHBOARD)}>
            홈으로
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            팝업창
          </Button>
        </div>
      </div>

      {/* 통합 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input placeholder="법령명, 조항, 키워드로 검색" className="flex-1" />
            <Button>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 법령 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>제2. 식품일반에 대한 공통기준 및 규격</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">제1. 식품일반에 관한 규격</h4>
            <div className="text-gray-700 space-y-2">
              <p>1) 원료 등에 구비요건</p>
              <p className="pl-4">
                (1) 식품의 제조에 사용하는 원료는 인체를 목표로 채취, 취급, 가공, 정제 또는 모든 관련된 것이라야 한다.
              </p>
              <p className="pl-4">
                (2) 원료는 품질, 선도와 양호하고 부패·변질되거나, 유해물질 등이 오염되어 있지 아니한 것으로 인체상을
                가지지 않아야 한다.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">제2. 식품일반에 대한 공통기준 및 규격</h4>
            <div className="text-gray-700 space-y-2">
              <p>1) 원료 등에 구비요건</p>
              <p className="pl-4">
                (1) 식품의 제조에 사용하는 원료는 인체를 목표로 채취, 취급, 가공, 정제 또는 모든 관련된 것이라야 한다.
              </p>
              <p className="pl-4">
                (2) 원료는 품질, 선도와 양호하고 부패·변질되거나, 유해물질 등이 오염되어 있지 아니한 것으로 인체상을
                가지지 않아야 한다.
              </p>
              <p className="pl-4">
                (3) 식품첨가물·기구·용기·포장상에서 원료는 적절히하여 기초처리의 원료를 사용하여야 한다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case SECTIONS.DASHBOARD:
        return renderDashboard()
      case SECTIONS.STANDARDS:
        return renderStandards()
      case SECTIONS.RESULT:
        return renderResult()
      case SECTIONS.LAW_UPDATES:
        return renderLawUpdates()
      case SECTIONS.LAW_DETAILS:
        return renderLawDetails()
      case SECTIONS.SETTINGS:
        return renderSettings()
      case SECTIONS.PRODUCT_WIZARD:
        return renderProductWizard()
      case SECTIONS.PRODUCT_WIZARD_STEP1:
        return renderProductWizard(1)
      case SECTIONS.PRODUCT_WIZARD_STEP2:
        return renderProductWizard(2)
      case SECTIONS.PRODUCT_WIZARD_STEP3:
        return renderProductWizard(3)
      case SECTIONS.PRODUCT_WIZARD_STEP4:
        return renderProductWizard(4)
      default:
        return renderDashboard()
    }
  }

  // 키보드 단축키 설정
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  useKeyboardShortcuts({
    onNavigate: showSection,
    onSave: saveCurrentProduct,
    onSearch: () => {
      searchInputRef.current?.focus()
    },
    onNewProduct: () => showSection(SECTIONS.PRODUCT_WIZARD),
  })

  return (
    <SidebarProvider>
      <AppSidebar onNavigate={showSection} currentSection={currentSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">FoodLaw</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentSection === SECTIONS.DASHBOARD
                    ? "대시보드"
                    : currentSection === SECTIONS.STANDARDS
                      ? "제품관리"
                      : currentSection === SECTIONS.RESULT
                        ? "분석결과"
                        : currentSection === SECTIONS.LAW_UPDATES
                          ? "법령업데이트"
                          : currentSection === SECTIONS.LAW_DETAILS
                            ? "법령정보"
                            : currentSection === SECTIONS.SETTINGS
                              ? "설정"
                              : currentSection === SECTIONS.PRODUCT_WIZARD
                                ? "제품 등록 마법사"
                                : currentSection === SECTIONS.PRODUCT_WIZARD_STEP1
                                  ? "1단계 - 제품 정보"
                                  : currentSection === SECTIONS.PRODUCT_WIZARD_STEP2
                                    ? "2단계 - 재료 입력"
                                    : currentSection === SECTIONS.PRODUCT_WIZARD_STEP3
                                      ? "3단계 - 영양성분 입력"
                                      : currentSection === SECTIONS.PRODUCT_WIZARD_STEP4
                                        ? "4단계 - 표시사항 입력"
                                        : "대시보드"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="검색..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{renderCurrentSection()}</div>
      </SidebarInset>


    </SidebarProvider>
  )
}
