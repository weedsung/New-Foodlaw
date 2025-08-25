import axios from "@/axiosConfig"

// 로컬 스토리지 관리 유틸리티
export const storage = {
  // 제품 데이터 저장/불러오기
  saveProducts: (product: any) => {
    axios.post("/product", product)
  },

  getProducts: (): any[] => {
    const data = localStorage.getItem("foodlaw_products")
    return data ? JSON.parse(data) : []
  },

  // 사용자 설정 저장/불러오기
  saveSettings: (settings: any) => {
    localStorage.setItem("foodlaw_settings", JSON.stringify(settings))
  },

  getSettings: () => {
    const data = localStorage.getItem("foodlaw_settings")
    return data
      ? JSON.parse(data)
      : {
          theme: "light",
          notifications: true,
          autoSave: true,
          language: "ko",
        }
  },

  // 분석 결과 저장/불러오기
  saveAnalysisResults: (results: any[]) => {
    localStorage.setItem("foodlaw_analysis_results", JSON.stringify(results))
  },

  getAnalysisResults: (): any[] => {
    const data = localStorage.getItem("foodlaw_analysis_results")
    return data ? JSON.parse(data) : []
  },

  // 법령 업데이트 저장/불러오기
  saveLawUpdates: (updates: any[]) => {
    localStorage.setItem("foodlaw_law_updates", JSON.stringify(updates))
  },

  getLawUpdates: (): any[] => {
    const data = localStorage.getItem("foodlaw_law_updates")
    return data ? JSON.parse(data) : []
  },
}
