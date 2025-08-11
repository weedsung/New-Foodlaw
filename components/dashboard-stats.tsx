"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const stats = [
  {
    title: "총 제품 수",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    title: "법규 준수율",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "검토 필요",
    value: "3",
    change: "-1",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    title: "이번 달 분석",
    value: "18",
    change: "+5",
    trend: "up",
    icon: Clock,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="ml-1">지난 달 대비</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
