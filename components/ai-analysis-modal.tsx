"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Brain } from "lucide-react"

interface AiAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  content: any
  onApply: () => void
}

export function AiAnalysisModal({ isOpen, onClose, content, onApply }: AiAnalysisModalProps) {
  if (!content) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI 자동채우기 결과</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>법규 준수율:</span>
            <Badge className="bg-green-600">{content.compliance}%</Badge>
          </div>

          <div>
            <h4 className="font-medium mb-2">AI 추천사항:</h4>
            <ul className="space-y-2">
              {content.recommendations?.map((rec: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {content.details && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">{content.details}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={onApply} className="bg-purple-600 hover:bg-purple-700">
            적용하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
