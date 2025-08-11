"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Clock, CheckCircle, ArrowRight } from "lucide-react"

const priorityTasks = [
  {
    id: 1,
    title: "저당 스무디 나트륨 함량 검토",
    description: "기준 초과로 인한 긴급 검토 필요",
    priority: "high",
    dueDate: "오늘",
    progress: 30,
    assignee: "김품질",
  },
  {
    id: 2,
    title: "콩국수 밀키트 최종 승인",
    description: "모든 검토 완료, 승인 대기 중",
    priority: "medium",
    dueDate: "내일",
    progress: 90,
    assignee: "이관리",
  },
  {
    id: 3,
    title: "12월 법령 업데이트 적용",
    description: "새로운 나트륨 기준 적용 필요",
    priority: "high",
    dueDate: "3일 후",
    progress: 0,
    assignee: "박법규",
  },
  {
    id: 4,
    title: "된장찌개 밀키트 초기 분석",
    description: "신규 제품 등록 및 기본 분석",
    priority: "low",
    dueDate: "1주일 후",
    progress: 15,
    assignee: "최분석",
  },
]

export function PriorityTasks() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          우선순위 작업
          <Badge variant="outline">4개</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorityTasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1 capitalize">{task.priority}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>담당: {task.assignee}</span>
                    <span>마감: {task.dueDate}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>진행률</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            모든 작업 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
