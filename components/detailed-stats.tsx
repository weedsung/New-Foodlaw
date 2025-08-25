"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

const detailedStats = [
  {
    title: "총 제품 수",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Package,
    details: [
      { label: "이번 달 신규", value: "3개" },
      { label: "활성 제품", value: "21개" },
      { label: "보관 제품", value: "3개" },
    ],
  },
  {
    title: "개발 중",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Clock,
    details: [
      { label: "초기 단계", value: "3개" },
      { label: "진행 중", value: "4개" },
      { label: "최종 단계", value: "1개" },
    ],
  },
  {
    title: "개발 완료",
    value: "13",
    change: "+5",
    trend: "up",
    icon: CheckCircle,
    details: [
      { label: "이번 달 완료", value: "5개" },
      { label: "승인 완료", value: "11개" },
      { label: "출시 준비", value: "2개" },
    ],
  },
  {
    title: "검토 대기",
    value: "3",
    change: "-1",
    trend: "down",
    icon: AlertTriangle,
    details: [
      { label: "긴급 검토", value: "1개" },
      { label: "일반 검토", value: "2개" },
      { label: "재검토", value: "0개" },
    ],
  },
]

export function DetailedStats() {
  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {detailedStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mb-3">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">지난 달 대비</span>
              </p>
              <div className="space-y-1">
                {stat.details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
