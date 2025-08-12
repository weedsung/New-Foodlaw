# 📝 마이그레이션 템플릿

## 기본 정보
- **페이지/컴포넌트 명**: [예: 제품등록폼]
- **원본 파일**: [예: product-form.html]
- **마이그레이션 날짜**: [YYYY-MM-DD]
- **담당자**: [이름]

## 🎯 기능 분석

### 주요 기능
- [ ] 기능 1: [설명]
- [ ] 기능 2: [설명]
- [ ] 기능 3: [설명]

### 사용된 HTML 요소
```html
<!-- 주요 구조 복사 -->
<div class="container">
  <form id="productForm">
    <!-- ... -->
  </form>
</div>
```

### 사용된 CSS 클래스
```css
/* 주요 스타일 */
.container { /* ... */ }
.form-group { /* ... */ }
.btn-primary { /* ... */ }
```

### JavaScript 로직
```javascript
// 주요 로직
function submitForm() {
  // ...
}
```

## 🔄 변환 계획

### React 컴포넌트 구조
```tsx
// 목표 컴포넌트 구조
interface ComponentProps {
  // props 정의
}

function MigratedComponent({ }: ComponentProps) {
  // 상태 관리
  // 이벤트 핸들러
  // 렌더링
}
```

### shadcn/ui 매핑
- `<input>` → `<Input />`
- `<button>` → `<Button variant="..." />`
- `.container` → `<Card><CardContent>`
- `.form-group` → 적절한 spacing

### 상태 관리
- [ ] useState 사용
- [ ] useForm 사용 (React Hook Form)
- [ ] 커스텀 훅 필요성

## ✅ 마이그레이션 체크리스트

### 기본 구조
- [ ] HTML 구조 분석 완료
- [ ] React 컴포넌트 생성
- [ ] 기본 렌더링 확인

### 스타일링
- [ ] shadcn/ui 컴포넌트 적용
- [ ] CSS 변수 기반 색상 사용
- [ ] 반응형 디자인 확인

### 기능 구현
- [ ] 폼 제출 로직
- [ ] 유효성 검사
- [ ] 에러 처리

### 최적화
- [ ] 성능 최적화
- [ ] 접근성 개선
- [ ] TypeScript 타입 안전성

## 🐛 이슈 및 해결책

### 발견된 문제점
1. **문제**: [설명]
   - **해결책**: [해결 방법]

2. **문제**: [설명]
   - **해결책**: [해결 방법]

## 📊 개선 사항

### UI/UX 개선
- **개선 전**: [기존 상태]
- **개선 후**: [새로운 상태]

### 성능 개선
- **로딩 시간**: [전] → [후]
- **번들 크기**: [전] → [후]

## 🚀 배포 및 테스트

### 테스트 체크리스트
- [ ] 기능 테스트
- [ ] 브라우저 호환성
- [ ] 모바일 반응형
- [ ] 접근성 테스트

### 배포 준비
- [ ] 코드 리뷰 완료
- [ ] 문서 업데이트
- [ ] 사용자 가이드 작성
