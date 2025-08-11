"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface ProgressChartProps {
  label: string
  value: number
  maxValue: number
  status: "success" | "warning" | "error"
  unit: string
}

export function ProgressChart({ label, value, maxValue, status, unit }: ProgressChartProps) {
  const percentage = (value / maxValue) * 100

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-green-600"
      case "warning":
        return "bg-yellow-600"
      case "error":
        return "bg-red-600"
      default:
        return "bg-blue-600"
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="w-20 text-sm font-medium">{label}:</span>
      <div className="flex-1">
        <Progress
          value={percentage}
          className="h-3"
          style={{
            background: `linear-gradient(to right, ${getStatusColor()} 0%, ${getStatusColor()} ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-0 flex items-center space-x-2">
        <span>
          {value}
          {unit} (기준 {status === "success" ? "충족" : "초과"})
        </span>
        {getStatusIcon()}
      </span>
    </div>
  )
}
