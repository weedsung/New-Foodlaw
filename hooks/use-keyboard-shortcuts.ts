"use client"

import { useEffect } from "react"
import { useSettings } from "./use-settings"

interface KeyboardShortcutsProps {
  onNavigate: (section: string) => void
  onSave?: () => void
  onSearch?: () => void
  onNewProduct?: () => void
}

export function useKeyboardShortcuts({ onNavigate, onSave, onSearch, onNewProduct }: KeyboardShortcutsProps) {
  const { settings } = useSettings()

  useEffect(() => {
    if (!settings.keyboardShortcuts) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd 키가 눌린 경우에만 처리
      if (!(event.ctrlKey || event.metaKey)) return

      // 입력 필드에서는 단축키 비활성화
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      switch (event.key) {
        case "1":
          event.preventDefault()
          onNavigate("dashboard")
          break
        case "2":
          event.preventDefault()
          onNavigate("standards")
          break
        case "3":
          event.preventDefault()
          onNavigate("result")
          break
        case "n":
        case "N":
          event.preventDefault()
          onNewProduct?.()
          break
        case "s":
        case "S":
          event.preventDefault()
          onSave?.()
          break
        case "f":
        case "F":
          event.preventDefault()
          onSearch?.()
          break
        case ",":
          event.preventDefault()
          onNavigate("settings")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [settings.keyboardShortcuts, onNavigate, onSave, onSearch, onNewProduct])
}
