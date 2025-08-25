"use client"

import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"
import axios from "@/axiosConfig"

export interface Product {
  id: number,
  uid: number,
  product_name: string,
  product_type: string,
  product_explain: string,
  ingredient: Array<{
    id: number,
    product_id: number,
    ingredient_name: string,
    weight: number,
    rate: number,
    note: string,
    sodium: number,
    carbohydrate: number,
    sugar: number,
    fat: number,
    trans_fat: number,
    saturated_fat: number,
    cholesterol: number,
    protein: number,
    created_at: Date,
  }>,
  product_spec: Array<{
    id: number,
    product_id: number,
    classification: string,
    article: string,
    standard: string,
    management: string,
    created_at: Date,
  }>,
  raw_spec: Array<{
    id: number,
    product_id: number,
    classification: string,
    article: string,
    standard: string,
    management: string,
    created_at: Date,
  }>,
  labeling_info: {
    id: number,
    product_id: number,
    product_name: string,
    product_type: string,
    base_ingredient: string,
    weight: number,
    expiration_date: string,
    packing_material: string,
    report_id: number,
    company_info: string,
    return_info: string,
    store_info: string,
    allergy: string,
    customer_center: string,
    note: string,
    created_at: Date,
  },
  progress: string,
  regulation_rate: number,
  created_at: Date,
  updated_at: Date,
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    try {
      const initProducts = async () => {
        const response = await axios.get("/product")
        setProducts(response.data)
      }
      initProducts()
    } catch (error) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  // 제품 저장
  const saveProducts = (updatedProducts: Product) => {
    setProducts([...products, updatedProducts])
    storage.saveProducts(updatedProducts)
  }

  // 제품 추가
  const addProduct = (productData: Partial<Product>) => {
    const newProduct: Product = {
      id: 0,
      uid: 0,
      product_name: "",
      product_type: "",
      product_explain: "",
      ingredient: [],
      product_spec: [],
      raw_spec: [],
      labeling_info: {
        id: 0,
        product_id: 0,
        product_name: "",
        product_type: "",
        base_ingredient: "",
        weight: 0,
        expiration_date: "",
        packing_material: "",
        report_id: 0,
        company_info: "",
        return_info: "",
        store_info: "",
        allergy: "",
        customer_center: "",
        note: "",
        created_at: new Date(),
      },
      progress: "",
      regulation_rate: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    saveProducts(newProduct)
    return newProduct
  }

  // 제품 업데이트
  const updateProduct = (id: number, updates: Partial<Product>) => {
    
  }

  // 제품 삭제
  const deleteProduct = (id: number) => {
    
  }

  // 제품 검색
  const searchProducts = (query: string) => {
    if (!query.trim()) return products

    return products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(query.toLowerCase()) ||
        product.product_type.toLowerCase().includes(query.toLowerCase())
    )
  }

  // 제품 필터링
  const filterProducts = (filters: {
    progress?: string
    regulation_rate?: number
  }) => {
    return products.filter((product) => {
      if (filters.progress && product.progress !== filters.progress) return false
      if (filters.regulation_rate && product.regulation_rate !== filters.regulation_rate) return false
      return true
    })
  }

  // 통계 계산
  const getStatistics = () => {
    const total = products.length
    const completed = products.filter((p) => p.progress === "completed").length
    const reviewNeeded = products.filter((p) => p.progress === "review_needed").length
    const analyzing = products.filter((p) => p.progress === "analyzing").length

    const avgCompliance =
      products.filter((p) => p.regulation_rate).reduce((sum, p) => sum + (p.regulation_rate || 0), 0) /
        products.filter((p) => p.regulation_rate).length || 0

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
