"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const analysisData = [
  { category: "두류가공품", total: 8, passed: 7, failed: 1 },
  { category: "면류", total: 6, passed: 5, failed: 1 },
  { category: "조미료", total: 4, passed: 4, failed: 0 },
  { category: "음료", total: 3, passed: 2, failed: 1 },
  { category: "기타", total: 3, passed: 3, failed: 0 },
]

export function ProductAnalysisChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>제품 카테고리별 분석 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analysisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="#10b981" name="통과" />
            <Bar dataKey="failed" fill="#ef4444" name="실패" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
