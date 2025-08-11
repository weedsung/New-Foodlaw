"use client"

import { useState, useEffect } from "react"
import { storage } from "@/lib/storage"

export interface UserSettings {
  theme: "light" | "dark" | "system"
  notifications: {
    enabled: boolean
    email: boolean
    push: boolean
    lawUpdates: boolean
    analysisComplete: boolean
    reviewNeeded: boolean
    systemMaintenance: boolean
  }
  language: "ko" | "en"
  autoSave: boolean
  autoSaveInterval: number // minutes
  dateFormat: "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY"
  timezone: string
  compactMode: boolean
  showTooltips: boolean
  defaultView: "dashboard" | "standards" | "result"
  itemsPerPage: number
  soundEnabled: boolean
  keyboardShortcuts: boolean
}

const defaultSettings: UserSettings = {
  theme: "light",
  notifications: {
    enabled: true,
    email: true,
    push: true,
    lawUpdates: true,
    analysisComplete: true,
    reviewNeeded: true,
    systemMaintenance: true,
  },
  language: "ko",
  autoSave: true,
  autoSaveInterval: 5,
  dateFormat: "YYYY-MM-DD",
  timezone: "Asia/Seoul",
  compactMode: false,
  showTooltips: true,
  defaultView: "dashboard",
  itemsPerPage: 10,
  soundEnabled: true,
  keyboardShortcuts: true,
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [hasChanges, setHasChanges] = useState(false)

  // 설정 로드
  useEffect(() => {
    try {
      const savedSettings = storage.getSettings()
      setSettings({ ...defaultSettings, ...savedSettings })
    } catch (error) {
      console.error("설정 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 테마 적용
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement

      if (settings.theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.toggle("dark", systemTheme === "dark")
      } else {
        root.classList.toggle("dark", settings.theme === "dark")
      }
    }

    applyTheme()

    // 시스템 테마 변경 감지
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", applyTheme)
      return () => mediaQuery.removeEventListener("change", applyTheme)
    }
  }, [settings.theme])

  // 설정 업데이트
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    setHasChanges(true)
  }

  // 설정 저장
  const saveSettings = async () => {
    try {
      storage.saveSettings(settings)
      setHasChanges(false)
      return { success: true }
    } catch (error) {
      console.error("설정 저장 실패:", error)
      return { success: false, error: "설정 저장에 실패했습니다." }
    }
  }

  // 설정 초기화
  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasChanges(true)
  }

  // 설정 내보내기
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `foodlaw-settings-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 설정 가져오기
  const importSettings = (file: File): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          setSettings({ ...defaultSettings, ...importedSettings })
          setHasChanges(true)
          resolve({ success: true })
        } catch (error) {
          resolve({ success: false, error: "잘못된 설정 파일입니다." })
        }
      }
      reader.onerror = () => {
        resolve({ success: false, error: "파일 읽기에 실패했습니다." })
      }
      reader.readAsText(file)
    })
  }

  return {
    settings,
    loading,
    hasChanges,
    updateSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
  }
}
