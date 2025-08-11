"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSettings } from "@/hooks/use-settings"
import {
  Settings,
  Palette,
  Bell,
  Globe,
  Save,
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Keyboard,
  Clock,
  Database,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface SettingsPageProps {
  onClose?: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { settings, loading, hasChanges, updateSettings, saveSettings, resetSettings, exportSettings, importSettings } =
    useSettings()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setSaving(true)
    const result = await saveSettings()

    if (result.success) {
      setMessage({ type: "success", text: "설정이 저장되었습니다." })
    } else {
      setMessage({ type: "error", text: result.error || "저장에 실패했습니다." })
    }

    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleReset = () => {
    if (confirm("모든 설정을 초기값으로 되돌리시겠습니까?")) {
      resetSettings()
      setMessage({ type: "success", text: "설정이 초기화되었습니다." })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const result = await importSettings(file)
    if (result.success) {
      setMessage({ type: "success", text: "설정을 가져왔습니다." })
    } else {
      setMessage({ type: "error", text: result.error || "가져오기에 실패했습니다." })
    }

    setTimeout(() => setMessage(null), 3000)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
        설정 로딩 중...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">설정</h2>
          <p className="text-gray-600 dark:text-gray-400">시스템 설정을 관리합니다</p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              저장되지 않은 변경사항
            </Badge>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            외관
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            알림
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            일반
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            고급
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            데이터
          </TabsTrigger>
        </TabsList>

        {/* 외관 설정 */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                테마 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">테마</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark" | "system") => updateSettings({ theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        라이트 모드
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        다크 모드
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        시스템 설정 따름
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode">컴팩트 모드</Label>
                  <p className="text-sm text-muted-foreground">더 작은 간격으로 더 많은 정보를 표시합니다</p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-tooltips">툴팁 표시</Label>
                  <p className="text-sm text-muted-foreground">버튼과 아이콘에 도움말 툴팁을 표시합니다</p>
                </div>
                <Switch
                  id="show-tooltips"
                  checked={settings.showTooltips}
                  onCheckedChange={(checked) => updateSettings({ showTooltips: checked })}
                />
              </div>

              <div>
                <Label htmlFor="items-per-page">페이지당 항목 수</Label>
                <Select
                  value={settings.itemsPerPage.toString()}
                  onValueChange={(value) => updateSettings({ itemsPerPage: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5개</SelectItem>
                    <SelectItem value="10">10개</SelectItem>
                    <SelectItem value="20">20개</SelectItem>
                    <SelectItem value="50">50개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-enabled">알림 활성화</Label>
                  <p className="text-sm text-muted-foreground">모든 알림을 활성화/비활성화합니다</p>
                </div>
                <Switch
                  id="notifications-enabled"
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      notifications: { ...settings.notifications, enabled: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">알림 유형</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>이메일 알림</Label>
                    <p className="text-sm text-muted-foreground">중요한 업데이트를 이메일로 받습니다</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, email: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>푸시 알림</Label>
                    <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, push: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>법령 업데이트</Label>
                    <p className="text-sm text-muted-foreground">새로운 법령 업데이트 알림</p>
                  </div>
                  <Switch
                    checked={settings.notifications.lawUpdates}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, lawUpdates: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>분석 완료</Label>
                    <p className="text-sm text-muted-foreground">AI 분석 완료 시 알림</p>
                  </div>
                  <Switch
                    checked={settings.notifications.analysisComplete}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, analysisComplete: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>검토 필요</Label>
                    <p className="text-sm text-muted-foreground">검토가 필요한 항목 알림</p>
                  </div>
                  <Switch
                    checked={settings.notifications.reviewNeeded}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, reviewNeeded: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>시스템 점검</Label>
                    <p className="text-sm text-muted-foreground">시스템 점검 및 업데이트 알림</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemMaintenance}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: { ...settings.notifications, systemMaintenance: checked },
                      })
                    }
                    disabled={!settings.notifications.enabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                언어 및 지역
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">언어</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value: "ko" | "en") => updateSettings({ language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-format">날짜 형식</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY") =>
                    updateSettings({ dateFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YYYY-MM-DD">2024-12-25</SelectItem>
                    <SelectItem value="MM/DD/YYYY">12/25/2024</SelectItem>
                    <SelectItem value="DD/MM/YYYY">25/12/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">시간대</Label>
                <Select value={settings.timezone} onValueChange={(value) => updateSettings({ timezone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Seoul">서울 (UTC+9)</SelectItem>
                    <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                    <SelectItem value="America/New_York">뉴욕 (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London">런던 (UTC+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="default-view">기본 화면</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value: "dashboard" | "standards" | "result") =>
                    updateSettings({ defaultView: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">대시보드</SelectItem>
                    <SelectItem value="standards">제품 관리</SelectItem>
                    <SelectItem value="result">분석 결과</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                자동 저장
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">자동 저장 활성화</Label>
                  <p className="text-sm text-muted-foreground">작업 내용을 자동으로 저장합니다</p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                />
              </div>

              <div>
                <Label htmlFor="auto-save-interval">자동 저장 간격 (분)</Label>
                <Select
                  value={settings.autoSaveInterval.toString()}
                  onValueChange={(value) => updateSettings({ autoSaveInterval: Number.parseInt(value) })}
                  disabled={!settings.autoSave}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1분</SelectItem>
                    <SelectItem value="5">5분</SelectItem>
                    <SelectItem value="10">10분</SelectItem>
                    <SelectItem value="30">30분</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 고급 설정 */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                접근성 및 상호작용
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-enabled">사운드 효과</Label>
                  <p className="text-sm text-muted-foreground">알림 및 상호작용 사운드를 재생합니다</p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="keyboard-shortcuts">키보드 단축키</Label>
                  <p className="text-sm text-muted-foreground">키보드 단축키를 활성화합니다</p>
                </div>
                <Switch
                  id="keyboard-shortcuts"
                  checked={settings.keyboardShortcuts}
                  onCheckedChange={(checked) => updateSettings({ keyboardShortcuts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>키보드 단축키</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>대시보드로 이동</span>
                  <Badge variant="outline">Ctrl + 1</Badge>
                </div>
                <div className="flex justify-between">
                  <span>제품 관리로 이동</span>
                  <Badge variant="outline">Ctrl + 2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>분석 결과로 이동</span>
                  <Badge variant="outline">Ctrl + 3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>새 제품 추가</span>
                  <Badge variant="outline">Ctrl + N</Badge>
                </div>
                <div className="flex justify-between">
                  <span>저장</span>
                  <Badge variant="outline">Ctrl + S</Badge>
                </div>
                <div className="flex justify-between">
                  <span>검색</span>
                  <Badge variant="outline">Ctrl + F</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 데이터 관리 */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                설정 백업 및 복원
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>설정 내보내기</Label>
                  <p className="text-sm text-muted-foreground">현재 설정을 파일로 저장합니다</p>
                </div>
                <Button onClick={exportSettings} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  내보내기
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>설정 가져오기</Label>
                  <p className="text-sm text-muted-foreground">저장된 설정 파일을 불러옵니다</p>
                </div>
                <div>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    가져오기
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>설정 초기화</Label>
                  <p className="text-sm text-muted-foreground">모든 설정을 기본값으로 되돌립니다</p>
                </div>
                <Button onClick={handleReset} variant="destructive">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>저장소 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>설정 데이터</span>
                  <span>{JSON.stringify(settings).length} bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>제품 데이터</span>
                  <span>계산 중...</span>
                </div>
                <div className="flex justify-between">
                  <span>분석 결과</span>
                  <span>계산 중...</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>총 사용량</span>
                  <span>계산 중...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? "저장되지 않은 변경사항이 있습니다." : "모든 변경사항이 저장되었습니다."}
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleReset} variant="outline" disabled={saving}>
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  )
}
