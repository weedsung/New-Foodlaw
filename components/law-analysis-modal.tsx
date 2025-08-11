"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, ExternalLink } from "lucide-react"

interface LawAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  content: any
}

export function LawAnalysisModal({ isOpen, onClose, content }: LawAnalysisModalProps) {
  if (!content) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span>법령 분석 결과</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span>준수 상태:</span>
            <Badge variant={content.compliance === "준수" ? "default" : "destructive"}>{content.compliance}</Badge>
          </div>

          <div>
            <h4 className="font-medium mb-2">적용 법령:</h4>
            <div className="space-y-2">
              {content.laws?.map((law: any, index: number) => (
                <div key={index} className="border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{law.name}</h5>
                      <p className="text-sm text-gray-600">{law.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {content.warnings && content.warnings.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">주의사항:</h4>
              <ul className="space-y-1">
                {content.warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
