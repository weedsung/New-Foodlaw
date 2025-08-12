# 🗺️ 제품 등록 마법사 마이그레이션 로드맵

## 🎯 **전체 마이그레이션 전략**

### 📊 **현재 상황 분석**
- **기존 React 앱**: 단일 페이지, 섹션 기반 네비게이션
- **HTML 서비스**: 4단계 마법사, 독립적인 플로우
- **통합 목표**: 기존 앱의 "새 제품 등록"을 마법사로 대체

---

## 🏗️ **Phase 1: 기본 인프라 구축** (1-2일)

### **1.1 프로젝트 구조 설정**
```
components/
├── product-wizard/           # 새로운 마법사 컴포넌트들
│   ├── ProductWizard.tsx    # 메인 컨테이너
│   ├── StepIndicator.tsx    # 단계 표시기
│   ├── WizardHeader.tsx     # 헤더 컴포넌트
│   └── steps/               # 각 단계별 컴포넌트
│       ├── Step1ProductInfo.tsx
│       ├── Step2Ingredients.tsx
│       ├── Step3Nutrition.tsx
│       ├── Step4Labeling.tsx
│       └── Step5Summary.tsx
├── ui/                      # 새로운 shadcn/ui 컴포넌트
│   ├── stepper.tsx         # 스텝 인디케이터
│   ├── data-table.tsx      # 동적 테이블
│   └── wizard-layout.tsx   # 마법사 레이아웃
```

### **1.2 shadcn/ui 컴포넌트 추가**
```bash
npx shadcn@latest add progress
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
```

### **1.3 상태 관리 설계**
```typescript
interface WizardState {
  currentStep: number
  productInfo: ProductInfo
  ingredients: Ingredient[]
  nutrition: NutritionData
  labeling: LabelingData
  isComplete: boolean
}
```

---

## 🏗️ **Phase 2: 핵심 컴포넌트 구현** (3-4일)

### **2.1 마법사 컨테이너 구현**
- [ ] `ProductWizard.tsx` 메인 컴포넌트
- [ ] 단계별 네비게이션 로직
- [ ] 상태 관리 (useState 또는 zustand)
- [ ] 데이터 유효성 검사

### **2.2 Step Indicator 구현**
- [ ] `StepIndicator.tsx` 컴포넌트
- [ ] 진행 상태 시각화
- [ ] 클릭 가능한 단계 이동
- [ ] 반응형 디자인

### **2.3 헤더 컴포넌트**
- [ ] `WizardHeader.tsx` 구현
- [ ] 저장 기능 연동
- [ ] 종료/취소 확인 다이얼로그

---

## 🏗️ **Phase 3: 단계별 컴포넌트 구현** (5-8일)

### **3.1 Step 1: 제품 정보 입력**
```typescript
// Step1ProductInfo.tsx 구현 요소
- 제품명 입력 (shadcn Input)
- 주요 성분 입력 (shadcn Textarea)
- AI 분석 버튼 (shadcn Button + 로딩 상태)
- AI 추천 결과 카드 (shadcn Card)
```

### **3.2 Step 2: 재료 입력**
```typescript
// Step2Ingredients.tsx 구현 요소
- 제품 정보 요약 카드
- 동적 재료 테이블 (shadcn Table + 커스텀 로직)
- 행 추가/삭제 버튼들
- AI 자동채우기 모달
- 법령 분석 모달
```

### **3.3 Step 3: 영양성분 입력**
```typescript
// Step3Nutrition.tsx 구현 요소
- 영양성분 테이블
- DB 연결 기능
- AI 분석 기능
- 자동 계산 로직
```

### **3.4 Step 4: 표시사항**
```typescript
// Step4Labeling.tsx 구현 요소
- 표시사항 미리보기 테이블
- 표시사항 작성 테이블
- AI 식품유형 분석
- 법령 분석 기능
```

### **3.5 Step 5: 최종 확인**
```typescript
// Step5Summary.tsx 구현 요소
- 전체 정보 요약 뷰
- PDF 생성 기능
- 최종 저장 기능
```

---

## 🏗️ **Phase 4: 기존 앱 통합** (2-3일)

### **4.1 라우팅 통합**
- [ ] 기존 앱의 "새 제품 등록" 버튼 수정
- [ ] 마법사 페이지로 네비게이션
- [ ] 뒤로가기/완료 후 원래 페이지 복귀

### **4.2 데이터 연동**
- [ ] 기존 `useProducts` 훅과 연동
- [ ] 저장된 제품 데이터 기존 목록에 표시
- [ ] 편집 모드 지원

### **4.3 스타일 통합**
- [ ] 기존 앱 테마와 일치
- [ ] shadcn/ui 색상 팔레트 적용
- [ ] 반응형 디자인 최적화

---

## 🏗️ **Phase 5: 고급 기능 구현** (3-5일)

### **5.1 AI 기능 연동**
- [ ] AI 제품 유형 추천 API
- [ ] AI 재료 자동채우기 API
- [ ] AI 영양성분 분석 API
- [ ] AI 식품유형 분석 API

### **5.2 법령 분석 기능**
- [ ] 법령 데이터베이스 연동
- [ ] 규정 준수 여부 체크
- [ ] 권고사항 표시

### **5.3 PDF 생성**
- [ ] 클라이언트 사이드 PDF 생성
- [ ] 기존 `pdfGenerator` 라이브러리 활용
- [ ] 템플릿 기반 PDF 포맷

---

## 🧪 **Phase 6: 테스트 및 최적화** (2-3일)

### **6.1 기능 테스트**
- [ ] 각 단계별 기능 검증
- [ ] 데이터 유실 방지 테스트
- [ ] 브라우저 호환성 테스트

### **6.2 UX 개선**
- [ ] 로딩 상태 표시
- [ ] 에러 핸들링
- [ ] 사용자 가이드

### **6.3 성능 최적화**
- [ ] 컴포넌트 lazy loading
- [ ] 메모이제이션 적용
- [ ] 번들 크기 최적화

---

## 📋 **구현 순서 요약**

### **🥇 최우선 (이번 주)**
1. **Step Indicator 컴포넌트** - 가장 재사용성 높음
2. **기본 마법사 구조** - 전체 플로우 기반
3. **Step 1 (제품 정보)** - 가장 단순한 폼

### **🥈 두 번째 우선순위 (다음 주)**
4. **Step 2 (재료 입력)** - 동적 테이블 구현
5. **기존 앱 통합** - 네비게이션 연결

### **🥉 세 번째 우선순위 (이후)**
6. **나머지 단계들** (영양성분, 표시사항, 요약)
7. **AI/법령 기능** - 외부 API 연동
8. **PDF 생성** - 추가 기능

---

## ⚡ **빠른 시작 가이드**

### **다음 30분에 할 일:**
1. `components/product-wizard/` 폴더 생성
2. `StepIndicator.tsx` 컴포넌트 기본 구조 생성
3. shadcn/ui `progress` 컴포넌트 설치

### **오늘 목표:**
- Step Indicator 완전 구현
- 기본 마법사 레이아웃 완성
- Step 1 프로토타입 시작

**지금 바로 시작하시겠습니까? 어떤 컴포넌트부터 만들어볼까요?** 🚀
