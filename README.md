# Bumin Web V2 Boilerplate

React + TypeScript + Vite 기반으로 구성된 스타터 템플릿입니다.  
React Query, Recoil, Styled-Components, React Router, Axios 토큰 갱신 로직 등을 기본 제공해 팀 내 공통 보일러플레이트로 활용할 수 있습니다.

---

## 주요 기술 스택

- React 19, TypeScript 5, Vite 7
- React Router DOM 7 (코드 스플리팅 기반 라우팅)
- @tanstack/react-query 5 (전역 쿼리 설정 + Devtools)
- Recoil 상태 관리 및 persist 키 세팅
- Styled-Components + styled-normalize + 테마 시스템
- Axios 인스턴스 & 토큰 자동 갱신 인터셉터

---

## 사전 준비

- Node.js 20 LTS 이상
- npm 또는 pnpm (본 가이드는 `npm` 명령어 기준)
- `.env` 파일에 API URL, 앱 이름 등 환경 변수 정의

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000 자동 오픈)
npm run dev

# 타입 검사 및 빌드
npm run typecheck
npm run build

# 프로덕션 빌드 미리보기
npm run preview
```

---

## 환경 변수 설정

프로젝트 루트에 `.env` 또는 `.env.local` 파일을 생성하고 아래 값을 정의하세요.

```
VITE_APP_NAME=your-app-name
VITE_API_BASE_URL=https://api.example.com
```

- `VITE_APP_NAME` : 토큰 키 및 Recoil persist key 생성에 사용됩니다.
- `VITE_API_BASE_URL` : Axios 인스턴스 기본 URL로, 토큰 리프레시 요청도 이 값을 기준으로 전송됩니다.

필요한 환경 변수는 `import.meta.env`를 통해 접근하며 `src/lib/constants/sharedStrings.tsx`, `src/lib/axios.ts` 등에서 사용 중입니다.

---

## 프로젝트 구조

```
src/
  AppProviders.tsx           # 전역 Provider (Recoil, QueryClient, Theme, Router)
  main.tsx                   # 엔트리 포인트
  lib/
    axios.ts                 # Axios 인스턴스 + 토큰 리프레시 인터셉터
    queryClient.ts           # React Query 기본 옵션
    constants/
      queryConfig.ts         # 쿼리 프리셋 (default/dashboard/realtime 등)
      refreshInterval.ts
      sharedStrings.tsx      # 토큰/퍼시스트 키 네이밍 규칙
    core/routes/
      Routes.tsx             # Lazy 로딩 라우트 테이블
      ProtectedRoute.tsx     # 토큰 기반 접근 제어 HOC
    functions/
      authFunctions.ts       # 토큰 CRUD 및 로그아웃 헬퍼
  pages/
    HomePage.tsx             # Protected Route 예시 페이지
    auth/LoginPage.tsx       # 임시 로그인 로직 샘플
    404/NotFoundPage.tsx
  store/exampleAtom.ts       # Recoil atom 샘플
  styles/
    GlobalStyle.ts           # styled-normalize + 글로벌 스타일
    theme.ts                 # 공통 테마 (colors, spacing 등)
    styled.d.ts              # theme 타입 선언
```

---

## 핵심 모듈 가이드

- **AppProviders**  
  RecoilRoot, QueryClientProvider, ThemeProvider, BrowserRouter를 한 번에 감싸 전역 상태와 스타일을 세팅합니다. 신규 Provider 추가 시 이 파일을 수정하세요.

- **라우팅 (`src/lib/core/routes`)**  
  `Routes.tsx`에서 lazy import와 `useRoutes`를 사용해 라우트를 선언합니다. 인증이 필요한 페이지는 `ProtectedRoute`로 감싸 토큰 여부를 확인합니다.

- **인증/토큰 관리 (`src/lib/functions/authFunctions.ts`)**  
  로그인 토큰을 저장·조회·삭제하고 로그아웃 시 Recoil persist 데이터를 함께 초기화합니다. 실제 API 연동 시 이 헬퍼를 확장하세요.

- **Axios 인프라 (`src/lib/axios.ts`)**  
  요청마다 Access Token을 헤더에 주입하고, 401 응답 시 Refresh Token으로 자동 재발급 후 재시도합니다. 공통 에러 처리나 헤더 정책이 필요하면 이 파일에서 확장합니다.

- **React Query 설정 (`src/lib/constants/queryConfig.ts`)**  
  `getQueryConfig('dashboard')`처럼 호출 용도에 맞는 프리셋을 선택할 수 있어 API 호출 정책을 일관되게 유지할 수 있습니다.

- **스타일 시스템 (`src/styles`)**  
  `theme.ts`에 정의된 색상과 간격 유틸을 기반으로 styled-components에서 `theme` prop을 활용하세요.

---

## 개발 스크립트

- `npm run dev` : Vite 개발 서버 (기본 포트 3000)
- `npm run build` : 타입 검사 후 프로덕션 번들 생성 (`dist/`)
- `npm run preview` : 빌드 결과 미리보기 서버
- `npm run typecheck` : TypeScript 프로젝트 전역 타입 검사
- `npm run lint` : ESLint 검사

---

## 시작 가이드 요약

1. 이 레포지토리를 템플릿으로 사용하거나 클론합니다.
2. `.env`를 작성해 앱 이름과 API 서버 주소를 설정합니다.
3. `npm install` 후 `npm run dev`로 개발을 시작합니다.
4. 라우트, 페이지, 상태 관리를 도메인에 맞게 확장합니다.
5. Axios 요청 유틸과 React Query 프리셋을 통해 API 연동 로직을 통일합니다.

이 템플릿을 바탕으로 공통 레이아웃, 디자인 시스템, 에러 바운더리 등의 인프라를 추가해 팀 표준 보일러플레이트를 완성해보세요. 즐거운 개발 되세요! 🚀
