"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, ExternalLink, Calendar } from "lucide-react"

const updates = [
  {
    id: 1,
    title: "식품위생법 개정",
    description: "나트륨 기준 600mg → 500mg으로 강화",
    date: "2024-12-15",
    type: "중요",
    isNew: true,
  },
  {
    id: 2,
    title: "식품공전 수정",
    description: "두류가공품에 대장균군 기준 추가",
    date: "2024-12-01",
    type: "일반",
    isNew: true,
  },
  {
    id: 3,
    title: "표시기준 개정",
    description: "영양성분 표시 방법 개선",
    date: "2024-11-20",
    type: "일반",
    isNew: false,
  },
]

export function LawUpdatesWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          법령 업데이트
          <Badge variant="destructive" className="ml-auto">
            2
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{update.title}</h4>
                    {update.isNew && (
                      <Badge variant="destructive" className="text-xs">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{update.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {update.date}
                    <Badge variant="outline" className="text-xs">
                      {update.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              {update.id !== updates.length && <div className="border-b" />}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            모든 업데이트 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
