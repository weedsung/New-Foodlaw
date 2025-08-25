import axiosInstance from "../axiosConfig"

// AI 분석 서비스
export const aiService = {
  // AI 제품 유형 분석 (백엔드 API 호출)
  analyzeProductType: async ({ productName, mainIngredients }: { productName: string; mainIngredients: string }): Promise<any> => {
    try {
      console.log("🔍 AI 제품 유형 분석 요청:", { productName, mainIngredients });
      const response = await axiosInstance.post('/analyze-product', { productName, mainIngredients });
      console.log("📡 백엔드 응답:", response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ AI 제품 유형 분석 오류:', error);
      
      // 백엔드 연결 실패 시 기본 추천 제공
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.log("🔄 백엔드 연결 실패, 기본 추천 제공");
        return {
          success: false,
          recommendations: [
            { type: "두류가공품", reason: "백엔드 연결 실패로 기본 추천", standard: "식품공전 기준", similarity_score: "N/A" },
            { type: "즉석조리식품", reason: "백엔드 연결 실패로 기본 추천", standard: "식품공전 기준", similarity_score: "N/A" },
            { type: "기타가공품", reason: "백엔드 연결 실패로 기본 추천", standard: "식품공전 기준", similarity_score: "N/A" }
          ],
          error: "백엔드 서버에 연결할 수 없습니다. Railway 서버가 실행 중인지 확인하세요."
        };
      }
      
      throw error;
    }
  },

  // AI 자동채우기 (백엔드 API 호출)
  autofillIngredients: async ({ productName, productType, totalWeight, mainIngredients }: { 
    productName: string; 
    productType: string; 
    totalWeight: number; 
    mainIngredients: string; 
  }): Promise<any> => {
    try {
      console.log("🔍 AI 자동채우기 요청:", { productName, productType, totalWeight, mainIngredients });
      const response = await axiosInstance.post('/ai-autofill', { 
        productName, 
        productType, 
        totalWeight, 
        mainIngredients 
      });
      console.log("📡 자동채우기 응답:", response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ AI 자동채우기 오류:', error);
      
      // 백엔드 연결 실패 시 기본 배합 제공
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.log("🔄 백엔드 연결 실패, 기본 배합 제공");
        return {
          recommendation: {
            ingredients: [
              { name: "기본 재료", weight: "100", ratio: "100" },
              { name: "보조 재료", weight: "50", ratio: "50" }
            ],
            explanation: "백엔드 연결 실패로 기본 배합을 제공합니다. Railway 서버가 실행 중인지 확인하세요."
          }
        };
      }
      
      throw error;
    }
  },

  // AI 분석 실행 (백엔드 API 호출)
  analyzeProduct: async (productData: any): Promise<any> => {
    try {
      // 백엔드에 제품 분석 요청
      const response = await axiosInstance.post('/analyze-product', {
        productName: productData.name || productData.product_name,
        mainIngredients: productData.ingredients || productData.ingredient || "정보 없음"
      });
      
      if (response.data.success) {
        return {
          compliance: 85, // 기본값, 백엔드에서 계산된 값으로 대체 가능
          recommendations: response.data.recommendations.map((rec: any) => rec.type),
          details: `AI 분석 결과 ${response.data.recommendations.length}개의 식품 유형을 추천합니다.`,
          riskLevel: "medium",
          timestamp: new Date().toISOString(),
          backendData: response.data
        };
      } else {
        throw new Error('백엔드 분석 실패');
      }
    } catch (error) {
      console.error('AI 제품 분석 오류:', error);
      // 오류 시 기본 응답 반환
      return {
        compliance: 0,
        recommendations: ["분석 중 오류가 발생했습니다."],
        details: "백엔드 연결에 실패했습니다.",
        riskLevel: "high",
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 법령 분석 실행 (백엔드 API 호출)
  analyzeLaw: async (productData: any): Promise<any> => {
    try {
      // 백엔드에 법령 분석 요청
      const response = await axiosInstance.post('/analyze-product', {
        productName: productData.name || productData.product_name,
        mainIngredients: productData.ingredients || productData.ingredient || "정보 없음"
      });
      
      if (response.data.success) {
        const recommendations = response.data.recommendations;
        return {
          laws: recommendations.map((rec: any) => ({
            name: rec.type,
            description: rec.reason
          })),
          compliance: recommendations.length > 0 ? "준수" : "검토 필요",
          warnings: recommendations.length > 0 ? [] : ["적용 가능한 법령을 찾을 수 없습니다."],
          timestamp: new Date().toISOString(),
          backendData: response.data
        };
      } else {
        throw new Error('백엔드 법령 분석 실패');
      }
    } catch (error) {
      console.error('AI 법령 분석 오류:', error);
      // 오류 시 기본 응답 반환
      return {
        laws: [],
        compliance: "검토 필요",
        warnings: ["백엔드 연결에 실패했습니다."],
        timestamp: new Date().toISOString(),
      };
    }
  },

  // 재료 기반 법령 분석 (백엔드 API 호출)
  analyzeLawIngredients: async (ingredients: any[]): Promise<any> => {
    try {
      console.log("🔍 법령 분석 요청:", ingredients);
      const response = await axiosInstance.post('/analyze-law', { ingredients });
      console.log("📡 법령 분석 응답:", response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ 법령 분석 오류:', error);
      
      // 백엔드 연결 실패 시 기본 분석 제공
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.log("🔄 백엔드 연결 실패, 기본 법령 분석 제공");
        return {
          compliance: true,
          issues: ["백엔드 연결 실패로 기본 분석을 제공합니다."],
          references: [
            {
              title: "식품위생법",
              content: "식품의 안전성과 품질을 보장하기 위한 기본 법령입니다."
            },
            {
              title: "식품 등의 표시기준",
              content: "식품의 표시사항에 대한 구체적인 기준을 제시합니다."
            }
          ]
        };
      }
      
      throw error;
    }
  },
}

// 식품 영양성분 데이터베이스 관련 함수들
export const foodNutritionService = {
  // 식품 검색 (벡터 검색 + 텍스트 검색 폴백)
  async searchFood(searchQuery: string, page: number = 1, limit: number = 20) {
    try {
      const response = await axiosInstance.get('/search-food', {
        params: { q: searchQuery, page, limit }
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('🔴 백엔드 서버에 연결할 수 없습니다.');
        return {
          success: false,
          data: [],
          error: '백엔드 서버에 연결할 수 없습니다.',
          search_method: 'fallback'
        };
      }
      console.error('식품 검색 오류:', error);
      throw error;
    }
  },

  // 특정 식품 상세 정보 조회
  async getFoodById(id: string | number) {
    try {
      const response = await axiosInstance.get(`/food/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('🔴 백엔드 서버에 연결할 수 없습니다.');
        return {
          success: false,
          data: null,
          error: '백엔드 서버에 연결할 수 없습니다.'
        };
      }
      console.error('식품 상세 조회 오류:', error);
      throw error;
    }
  },

  // 카테고리별 식품 조회
  async getFoodsByCategory(category: string, page: number = 1, limit: number = 20) {
    try {
      const response = await axiosInstance.get(`/food/category/${category}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('🔴 백엔드 서버에 연결할 수 없습니다.');
        return {
          success: false,
          data: [],
          error: '백엔드 서버에 연결할 수 없습니다.',
          search_method: 'fallback'
        };
      }
      console.error('카테고리별 식품 조회 오류:', error);
      throw error;
    }
  },

  // 전체 식품 목록 조회
  async getAllFoods(page: number = 1, limit: number = 50, sort: string = 'food_name', order: string = 'asc') {
    try {
      const response = await axiosInstance.get('/foods', {
        params: { page, limit, sort, order }
      });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('🔴 백엔드 서버에 연결할 수 없습니다.');
        return {
          success: false,
          data: [],
          error: '백엔드 서버에 연결할 수 없습니다.'
        };
      }
      console.error('전체 식품 목록 조회 오류:', error);
      throw error;
    }
  },

  // 영양성분 기반 유사 식품 추천
  async recommendSimilarFoods(nutritionData: {
    energy?: number;
    protein?: number;
    fat?: number;
    carbohydrate?: number;
    sodium?: number;
  }) {
    try {
      const response = await axiosInstance.post('/recommend-similar', nutritionData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.error('🔴 백엔드 서버에 연결할 수 없습니다.');
        return {
          success: false,
          data: [],
          error: '백엔드 서버에 연결할 수 없습니다.',
          search_method: 'fallback'
        };
      }
      console.error('유사 식품 추천 오류:', error);
      throw error;
    }
  }
};
