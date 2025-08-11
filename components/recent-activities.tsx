"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, FileText, AlertTriangle, CheckCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "analysis",
    title: "콩국수 밀키트 분석 완료",
    description: "법규 준수율 92% 달성",
    time: "2시간 전",
    status: "completed",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "warning",
    title: "저당 스무디 검토 필요",
    description: "나트륨 함량 기준 초과",
    time: "4시간 전",
    status: "warning",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "report",
    title: "월간 분석 보고서 생성",
    description: "12월 제품 분석 결과",
    time: "1일 전",
    status: "info",
    icon: FileText,
  },
  {
    id: 4,
    type: "analysis",
    title: "된장찌개 밀키트 등록",
    description: "새 제품 정보 입력 완료",
    time: "2일 전",
    status: "completed",
    icon: CheckCircle,
  },
]

export function RecentActivities() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIconColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "info":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          최근 활동
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={getStatusColor(activity.status)}>
                  <activity.icon className={`h-4 w-4 ${getIconColor(activity.status)}`} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            모든 활동 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
