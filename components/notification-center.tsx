"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { useState } from "react"

const initialNotifications = [
  {
    id: 1,
    type: "warning",
    title: "나트륨 기준 초과",
    message: "저당 스무디 제품의 나트륨 함량이 새로운 기준을 초과합니다.",
    time: "5분 전",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "분석 완료",
    message: "콩국수 밀키트 제품의 법규 준수 분석이 완료되었습니다.",
    time: "1시간 전",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "법령 업데이트",
    message: "식품위생법 시행규칙이 개정되었습니다.",
    time: "2시간 전",
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "검토 필요",
    message: "된장찌개 밀키트의 원료규격 검토가 필요합니다.",
    time: "3시간 전",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림 센터
          </div>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 4).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            모든 알림 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
