// AI 분석 서비스 (시뮬레이션)
export const aiService = {
  // AI 분석 실행 (시뮬레이션)
  analyzeProduct: async (productData: any): Promise<any> => {
    // 실제 API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const complianceRate = Math.floor(Math.random() * 20) + 80 // 80-100%

    const recommendations = [
      "배합비가 적절하게 설정되었습니다.",
      "나트륨 함량을 5% 줄이는 것을 권장합니다.",
      "단백질 함량이 기준을 충족합니다.",
      "첨가물 사용량을 검토해보세요.",
      "포장재 표시사항을 확인해주세요.",
    ]

    const selectedRecommendations = recommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2)

    return {
      compliance: complianceRate,
      recommendations: selectedRecommendations,
      details: `AI 분석 결과 전반적으로 ${complianceRate >= 90 ? "우수한" : complianceRate >= 80 ? "양호한" : "개선이 필요한"} 상태입니다.`,
      riskLevel: complianceRate >= 95 ? "low" : complianceRate >= 85 ? "medium" : "high",
      timestamp: new Date().toISOString(),
    }
  },

  // 법령 분석 실행 (시뮬레이션)
  analyzeLaw: async (productData: any): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const laws = [
      { name: "식품위생법 제7조", description: "식품 등의 표시기준에 관한 규정" },
      { name: "식품공전 제2편", description: "식품일반에 대한 공통기준 및 규격" },
      { name: "건강기능식품법 제16조", description: "건강기능식품의 표시·광고" },
      { name: "축산물위생관리법 제6조", description: "축산물의 위생적 취급기준" },
    ]

    const applicableLaws = laws.slice(0, Math.floor(Math.random() * 2) + 2)
    const compliance = Math.random() > 0.3 ? "준수" : "부분준수"

    const warnings =
      compliance === "준수"
        ? []
        : ["나트륨 함량 주의 필요", "표시사항 보완 필요", "첨가물 사용기준 확인 필요"].slice(
            0,
            Math.floor(Math.random() * 2) + 1,
          )

    return {
      laws: applicableLaws,
      compliance,
      warnings,
      timestamp: new Date().toISOString(),
    }
  },
}
