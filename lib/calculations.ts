// 계산 로직 유틸리티
export const calculations = {
  // 배합비 합계 계산
  calculateTotalPercentage: (ingredients: any[]) => {
    return ingredients.reduce((sum, item) => sum + (item.percentage || 0), 0)
  },

  // 법규 준수율 계산
  calculateComplianceRate: (specs: any[]) => {
    if (specs.length === 0) return 0

    const compliantSpecs = specs.filter((spec) => {
      // 간단한 준수 여부 판단 로직
      if (spec.standard.includes("≤")) {
        const standardValue = Number.parseFloat(spec.standard.replace(/[^0-9.]/g, ""))
        const managementValue = Number.parseFloat(spec.management.replace(/[^0-9.]/g, ""))
        return managementValue <= standardValue
      }
      if (spec.standard.includes("≥")) {
        const standardValue = Number.parseFloat(spec.standard.replace(/[^0-9.]/g, ""))
        const managementValue = Number.parseFloat(spec.management.replace(/[^0-9.]/g, ""))
        return managementValue >= standardValue
      }
      return spec.standard === spec.management
    })

    return Math.round((compliantSpecs.length / specs.length) * 100)
  },

  // 영양성분 계산
  calculateNutrition: (ingredients: any[]) => {
    // 더미 계산 로직 (실제로는 영양성분 DB가 필요)
    const totalWeight = ingredients.reduce((sum, item) => sum + (item.weight || 0), 0)

    return {
      calories: Math.round(totalWeight * 2.5), // 가정: 1g당 2.5kcal
      protein: Math.round(totalWeight * 0.15), // 가정: 15% 단백질
      fat: Math.round(totalWeight * 0.08), // 가정: 8% 지방
      carbs: Math.round(totalWeight * 0.6), // 가정: 60% 탄수화물
      sodium: Math.round(totalWeight * 0.01 * 1000), // 가정: 1% 나트륨 (mg)
    }
  },

  // 위험도 계산
  calculateRiskLevel: (complianceRate: number) => {
    if (complianceRate >= 95) return "low"
    if (complianceRate >= 85) return "medium"
    return "high"
  },
}
