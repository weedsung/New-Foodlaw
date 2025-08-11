// 데이터 검증 유틸리티
export const validators = {
  // 배합비 검증
  validateBlending: (ingredients: any[]) => {
    const errors: string[] = []

    // 빈 원료명 체크
    const emptyIngredients = ingredients.filter((item) => !item.ingredient.trim())
    if (emptyIngredients.length > 0) {
      errors.push("원료명을 입력해주세요.")
    }

    // 음수 값 체크
    const negativeValues = ingredients.filter((item) => item.percentage < 0 || item.weight < 0)
    if (negativeValues.length > 0) {
      errors.push("배합비와 중량은 0 이상이어야 합니다.")
    }

    // 합계 체크
    const total = ingredients.reduce((sum, item) => sum + item.percentage, 0)
    if (Math.abs(total - 100) > 0.1) {
      errors.push(`배합비 합계가 100%가 아닙니다. (현재: ${total.toFixed(1)}%)`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  // 제품 정보 검증
  validateProduct: (product: any) => {
    const errors: string[] = []

    if (!product.name?.trim()) {
      errors.push("제품명을 입력해주세요.")
    }

    if (!product.category?.trim()) {
      errors.push("제품 카테고리를 선택해주세요.")
    }

    if (!product.weight || product.weight <= 0) {
      errors.push("제품 중량을 올바르게 입력해주세요.")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  // 규격 검증
  validateSpec: (spec: any) => {
    const errors: string[] = []

    if (!spec.category?.trim()) {
      errors.push("분류를 입력해주세요.")
    }

    if (!spec.item?.trim()) {
      errors.push("항목을 입력해주세요.")
    }

    if (!spec.standard?.trim()) {
      errors.push("기준을 입력해주세요.")
    }

    if (!spec.management?.trim()) {
      errors.push("관리규격을 입력해주세요.")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}
