"use client"

import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"

export interface Product {
  id: string
  name: string
  category: string
  weight: number
  status: "draft" | "analyzing" | "completed" | "review_needed"
  complianceRate?: number
  lastModified: string
  assignee: string
  ingredients: Array<{
    id: number
    ingredient: string
    percentage: number
    weight: number
  }>
  productSpecs: Array<{
    id: number
    category: string
    item: string
    standard: string
    management: string
  }>
  rawSpecs: Array<{
    id: number
    category: string
    item: string
    standard: string
    management: string
  }>
  analysisResults?: any
  createdAt: string
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    try {
      const savedProducts = storage.getProducts()
      if (savedProducts.length === 0) {
        // 초기 더미 데이터
        const initialProducts: Product[] = [
          {
            id: "1",
            name: "콩국수 밀키트",
            category: "두류가공품",
            weight: 1000,
            status: "completed",
            complianceRate: 92,
            lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            assignee: "김품질",
            ingredients: [
              { id: 1, ingredient: "콩국", percentage: 74.1, weight: 700 },
              { id: 2, ingredient: "소면", percentage: 21.2, weight: 200 },
              { id: 3, ingredient: "기타", percentage: 4.7, weight: 100 },
            ],
            productSpecs: [
              { id: 1, category: "미생물", item: "대장균군", standard: "음성", management: "음성 확인" },
              { id: 2, category: "미생물", item: "살모넬라", standard: "음성", management: "음성 확인" },
              { id: 3, category: "화학", item: "나트륨", standard: "≤ 800mg/100g", management: "≤ 750mg/100g" },
            ],
            rawSpecs: [
              { id: 1, category: "품질", item: "수분", standard: "≤ 14%", management: "≤ 12%" },
              { id: 2, category: "품질", item: "단백질", standard: "≥ 35%", management: "≥ 37%" },
              { id: 3, category: "안전", item: "아플라톡신", standard: "≤ 15㎍/kg", management: "≤ 10㎍/kg" },
            ],
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "2",
            name: "저당 스무디",
            category: "음료",
            weight: 500,
            status: "review_needed",
            complianceRate: 78,
            lastModified: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            assignee: "이관리",
            ingredients: [
              { id: 1, ingredient: "과일퓨레", percentage: 60, weight: 300 },
              { id: 2, ingredient: "물", percentage: 35, weight: 175 },
              { id: 3, ingredient: "감미료", percentage: 5, weight: 25 },
            ],
            productSpecs: [
              { id: 1, category: "화학", item: "당분", standard: "≤ 10g/100ml", management: "≤ 8g/100ml" },
              { id: 2, category: "화학", item: "나트륨", standard: "≤ 100mg/100ml", management: "≤ 120mg/100ml" },
            ],
            rawSpecs: [{ id: 1, category: "품질", item: "당도", standard: "≥ 8Brix", management: "≥ 9Brix" }],
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setProducts(initialProducts)
        storage.saveProducts(initialProducts)
      } else {
        setProducts(savedProducts)
      }
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  // 제품 저장
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    storage.saveProducts(updatedProducts)
  }

  // 제품 추가
  const addProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name || "",
      category: productData.category || "",
      weight: productData.weight || 0,
      status: "draft",
      lastModified: new Date().toISOString(),
      assignee: productData.assignee || "미지정",
      ingredients: productData.ingredients || [],
      productSpecs: productData.productSpecs || [],
      rawSpecs: productData.rawSpecs || [],
      createdAt: new Date().toISOString(),
    }

    const updatedProducts = [...products, newProduct]
    saveProducts(updatedProducts)
    return newProduct
  }

  // 제품 업데이트
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? {
            ...product,
            ...updates,
            lastModified: new Date().toISOString(),
          }
        : product,
    )
    saveProducts(updatedProducts)
  }

  // 제품 삭제
  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    saveProducts(updatedProducts)
  }

  // 제품 검색
  const searchProducts = (query: string) => {
    if (!query.trim()) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.assignee.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // 제품 필터링
  const filterProducts = (filters: {
    status?: string
    category?: string
    assignee?: string
  }) => {
    return products.filter((product) => {
      if (filters.status && product.status !== filters.status) return false
      if (filters.category && product.category !== filters.category) return false
      if (filters.assignee && product.assignee !== filters.assignee) return false
      return true
    })
  }

  // 통계 계산
  const getStatistics = () => {
    const total = products.length
    const completed = products.filter((p) => p.status === "completed").length
    const reviewNeeded = products.filter((p) => p.status === "review_needed").length
    const analyzing = products.filter((p) => p.status === "analyzing").length

    const avgCompliance =
      products.filter((p) => p.complianceRate).reduce((sum, p) => sum + (p.complianceRate || 0), 0) /
        products.filter((p) => p.complianceRate).length || 0

    return {
      total,
      completed,
      reviewNeeded,
      analyzing,
      avgCompliance: Math.round(avgCompliance),
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProducts,
    getStatistics,
  }
}
