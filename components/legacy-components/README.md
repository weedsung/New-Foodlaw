# 🔄 Legacy Components & Migration Hub

이 폴더는 기존 HTML 서비스의 React/shadcn 리팩토링 및 UI 개선을 위한 중앙 허브입니다.

## 📁 폴더 구조

### `/html-originals/`
**원본 HTML/CSS/JS 파일 보관소**
- 기존 HTML 서비스의 원본 파일들
- CSS 스타일시트 및 JavaScript 파일
- 이미지 및 에셋 파일들
- **용도**: 참조용, 기능 분석, 스타일 추출

### `/ui-improvements/`
**UI 개선 중간 단계 파일들**
- 부분적으로 마이그레이션된 컴포넌트
- A/B 테스트용 UI 변형들
- 실험적 디자인 개선안
- **용도**: 점진적 개선, 사용자 테스트

### `/migration-notes/`
**마이그레이션 문서 및 가이드**
- 기능별 마이그레이션 계획서
- HTML → React 변환 매핑표
- 스타일 변환 가이드 (CSS → shadcn/ui)
- **용도**: 체계적 마이그레이션 관리

## 🎯 마이그레이션 워크플로우

### 1단계: 원본 분석
1. HTML 파일을 `/html-originals/`에 저장
2. 기능별로 분류 및 문서화
3. 사용된 CSS 스타일 추출
4. JavaScript 로직 분석

### 2단계: 컴포넌트 설계
1. HTML 구조를 React 컴포넌트로 분해
2. shadcn/ui 컴포넌트 매핑
3. 상태 관리 패턴 설계
4. 타입 정의 작성

### 3단계: 점진적 구현
1. 기본 구조 컴포넌트 생성
2. shadcn/ui 스타일 적용
3. 기능 로직 마이그레이션
4. `/ui-improvements/`에서 테스트

### 4단계: 최적화 및 통합
1. 성능 최적화
2. 접근성 개선
3. 반응형 디자인 강화
4. 메인 프로젝트로 통합

## 📋 마이그레이션 체크리스트

### HTML → React 변환
- [ ] HTML 구조 분석 완료
- [ ] React 컴포넌트 구조 설계
- [ ] Props 인터페이스 정의
- [ ] 이벤트 핸들러 매핑

### CSS → shadcn/ui 변환
- [ ] 기존 스타일 분석
- [ ] shadcn/ui 컴포넌트 선택
- [ ] CSS 변수 매핑
- [ ] 반응형 디자인 확인

### JavaScript → TypeScript 변환
- [ ] 로직 분석 및 분류
- [ ] 커스텀 훅 설계
- [ ] 타입 안전성 확보
- [ ] 성능 최적화 적용

### UI/UX 개선
- [ ] 사용성 개선 포인트 식별
- [ ] 접근성 강화
- [ ] 모던 디자인 패턴 적용
- [ ] 사용자 피드백 반영

## 🔗 관련 리소스

### 참조 문서
- [shadcn/ui 컴포넌트 가이드](https://ui.shadcn.com/docs)
- [React 마이그레이션 베스트 프랙티스](https://react.dev/learn/thinking-in-react)
- [Tailwind CSS 마이그레이션 가이드](https://tailwindcss.com/docs/migrating-to-tailwind)

### 도구 및 유틸리티
- [HTML to JSX 변환기](https://transform.tools/html-to-jsx)
- [CSS to Tailwind 변환기](https://transform.tools/css-to-tailwind)
- [React 개발자 도구](https://chrome.google.com/webstore/detail/react-developer-tools)

---

**최종 목표**: 기존 HTML 서비스를 현대적이고 유지보수 가능한 React/shadcn 애플리케이션으로 완전히 변환
