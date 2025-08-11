"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const detailedStats = [
  {
    title: "총 제품 수",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Package,
    details: [
      { label: "이번 달 신규", value: "3개" },
      { label: "분석 완료", value: "21개" },
      { label: "검토 중", value: "3개" },
    ],
  },
  {
    title: "법규 준수율",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    details: [
      { label: "완전 준수", value: "21개" },
      { label: "부분 준수", value: "2개" },
      { label: "미준수", value: "1개" },
    ],
  },
  {
    title: "검토 필요",
    value: "3",
    change: "-1",
    trend: "down",
    icon: AlertTriangle,
    details: [
      { label: "긴급", value: "1개" },
      { label: "일반", value: "2개" },
      { label: "예정", value: "0개" },
    ],
  },
  {
    title: "이번 달 분석",
    value: "18",
    change: "+5",
    trend: "up",
    icon: Clock,
    details: [
      { label: "AI 분석", value: "15개" },
      { label: "수동 분석", value: "3개" },
      { label: "재분석", value: "2개" },
    ],
  },
]

const teamStats = [
  { name: "김품질", role: "품질관리", tasks: 8, completed: 6 },
  { name: "이관리", role: "법규검토", tasks: 5, completed: 4 },
  { name: "박법규", role: "규정분석", tasks: 6, completed: 5 },
  { name: "최분석", role: "데이터분석", tasks: 4, completed: 4 },
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
