"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, BarChart3, FileText, Brain, Scale } from "lucide-react"

const actions = [
  {
    title: "새 제품 등록",
    description: "새로운 제품의 표시사항을 작성합니다",
    icon: Plus,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "법령 검색",
    description: "식품 관련 법령을 검색합니다",
    icon: Search,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "AI 분석",
    description: "AI를 통한 자동 분석을 실행합니다",
    icon: Brain,
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "법규 준수 분석",
    description: "제품의 법규 준수 상태를 확인합니다",
    icon: Scale,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "분석 결과",
    description: "최근 분석 결과를 확인합니다",
    icon: BarChart3,
    color: "bg-indigo-500 hover:bg-indigo-600",
  },
  {
    title: "보고서 생성",
    description: "PDF 보고서를 생성합니다",
    icon: FileText,
    color: "bg-red-500 hover:bg-red-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow bg-transparent"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
