# Pebble Frontend
> **할 일은 가볍게, 마감은 확실하게. 맥락을 설계하는 계층형 여정 관리 투두리스트**

## 📢 프로젝트 소개 (Project Overview)
**Pebble(페블)은** Category → Milestone → Task의 3단계 계층 구조를 통해 사용자가 지금 하는 일이 어떤 상위 목표를 위한 과정인지 한눈에 조망하고, 중요 데드라인을 놓치지 않으며 다음 행동을 자연스럽게 이어나갈 수 있도록 돕는 서비스입니다.

- **기획 배경:** 현대인의 할 일은 점점 복잡해지는데, 관리 도구는 여전히 단순한 ‘나열’에 머물러 있습니다. 수많은 프로젝트의 일정을 관리하기 위해 투두리스트에 '기간'을 억지로 기입하다 보면 발생하는 시각적 공해와 맥락 단절 현상을 해결하고자 합니다.
- **타겟 유저:** 
  - 주 타겟: 학업, 팀 프로젝트, 공모전 등 3개 이상의 일정을 동시에 수행하며 핵심 마감 관리에 어려움을 겪는 대학생 및 취준생
  - 부 타겟: 본업 외 사이드 프로젝트를 병행하는 주니어 N잡러
- **핵심 가치:** 
  - **할 일과 일정의 구조적 분리:** 오늘 할 일(Task)은 가볍게 나열하되, 프로젝트별 중요 일정(Milestone)은 캘린더 상에 독립된 이정표로 시각화합니다.
  - **계층 구조를 통한 맥락 부여:** 복잡한 세부 일정이 늘어나도 두꺼워지는 불편함 없이, 지금 하는 일이 어떤 목표의 일부인지 즉시 파악합니다.
  - **개인 일정 중심의 가벼운 공유:** 개인 일정 관리 흐름을 중심에 두면서 필요한 카테고리만 친구와 공유해 함께 관리할 수 있습니다.

<br/>

## 🚀 배포 링크 (Deployment)
- **[Pebble 배포 페이지 바로가기](https://pebble-frontend-six.vercel.app/)**

### CI/CD 배포 흐름

```text
Pull Request
  → Frontend Quality (type-check, lint, test, build)
  → develop Merge
  → Elric Fork develop 자동 동기화
  → Vercel Production 자동 배포
```

- `.github/workflows/frontend-quality.yml`: PR 및 `develop` Push에서 타입 검사, 린트, 자동화 테스트, 프로덕션 빌드를 검증합니다.
- `.github/workflows/sync-elric-fork.yml`: 원본 저장소의 `develop` 변경을 배포용 Fork의 `develop` 브랜치로 동기화합니다.
- Vercel은 배포용 Fork의 `develop` 브랜치를 감지해 최신 프론트엔드를 자동 배포합니다.
- Fork 동기화 인증값은 GitHub Actions Secret인 `ELRIC_FORK_SYNC_TOKEN`으로 관리하며 저장소에 노출하지 않습니다.

<br/>

## 👥 팀원 및 프론트엔드 역할 분담 (Team & Roles)

| 이름 | 역할 및 담당 도메인 | Github |
| :---: | :--- | :--- |
| **엘릭 / 심민식** | • 프론트엔드 팀장<br>• 깃허브 레포 초기 설정 및 구조 설계<br>• 홈·메인 캘린더 페이지 | [@minsik1014](https://github.com/minsik1014) |
| **심바 / 이채린** | • 랜딩페이지, 설정페이지 | [@Chae102](https://github.com/Chae102) |
| **요나 / 오윤아** | • 인증 및 리포트 페이지 | [@yoona24](https://github.com/yoona24) |
| **키위 / 윤규리** | • 마이페이지 및 친구 페이지 | [@kiwi13ird](https://github.com/kiwi13ird) |

<br/>

## 📱 화면 목록 및 플로우 (Screen List & Flow)

| 화면명 (Screen) | 경로 (Path) | 주요 기능 및 설명 |
| :--- | :--- | :--- |
| **랜딩** | `/landing` | • 서비스 소개, 핵심 기능 안내, 로그인/회원가입 진입 |
| **로그인** | `/login` | • 소셜 로그인 및 일반 로그인 플로우 진입점 |
| **회원가입** | `/signup`, `/profile-setup`, `/signup-complete` | • 계정 생성, 프로필 설정, 가입 완료 플로우 |
| **비밀번호 찾기** | `/forgot-password` | • 이메일 입력 및 비밀번호 재설정 플로우 |
| **홈** | `/`, `/home` | • 내 캘린더와 친구의 공개 캘린더 전환 조회<br>• 친구 일정 미조회 상태, 활동 기록, 친구 요청 수 표시 |
| **메인 캘린더** | `/calendar` | • Category, Milestone, Task 조회/생성/수정/삭제<br>• 사이드바와 월간 캘린더 기반 일정 렌더링<br>• API 로딩, 에러, 빈 상태 UI 처리 |
| **친구** | `/friends` | • 친구 검색, 요청, 수락 및 친구 관계 관리 |
| **마이페이지** | `/my`, `/my/profile` | • 사용자 프로필 및 프로필 이미지 편집, 활동·리포트 진입 |
| **설정** | `/settings` | • 알림 설정, 화면 설정, 계정 관리 등 사용자 환경 설정 |
| **월말 리포트** | `/report/*` | • 월간 활동, 카테고리·요일·친구 통계와 요약 이미지 생성 |
| **이메일 인증** | `/email/verify` | • 이메일 인증 결과 확인 및 후속 화면 이동 |

<br/>

## 🎨 Design System
- **[프로젝트 디자인 시스템 명세서 (design.md) 바로가기](./design.md)**

<br/>

## Implementation Highlights
Pebble 프론트엔드는 **기능 중심 구조**, **API 계층 분리**, **디자인 토큰 기반 UI**를 기준으로 구현합니다.

- **캘린더 API 상태 모델:** `calendarDataLoader`가 Category, Milestone, Task 조회와 응답 조합을 담당하고, `useCalendarState` 및 도메인별 액션 훅은 화면 상태와 변경 후 재조회를 관리합니다.
- **Feature API Layer:** `features/category/api`, `features/milestone/api`, `features/task/api`에서 도메인별 API 요청과 응답 타입을 관리합니다.
- **공통 API Client:** `services/api`에서 `VITE_API_BASE_URL`, 인증 토큰 주입, 공통 성공/실패 응답 타입을 처리합니다.
- **도메인 타입 분리:** 전역 타입에서 Category, Milestone, Task 역할을 구분하고, 화면 표시용 색상/폭 값은 별도 스타일 필드로 분리해 데이터 모델과 UI 책임을 명확히 합니다.
- **디자인 시스템 연동:** `design.md`, `tailwind.config.ts`, `styles/index.css`의 토큰을 기준으로 피그마 UI를 구현하고, 카테고리 색상은 유틸 함수로 파생 색상/텍스트 색상을 계산합니다.
- **이미지 크롭 공용화:** `components/ui/image-crop`에서 프로필 이미지와 카테고리 대표 이미지 크롭 로직을 공용으로 관리합니다.
- **Feature 중심 컴포넌트 구성:** category, milestone, task가 각각 자기 도메인의 UI를 소유하고, 여러 도메인이 공유하는 캘린더 폼/선택 UI는 `features/calendar/`에 배치합니다.
- **화면 단위 코드 스플리팅:** 라우트 진입점은 `React.lazy`로 분리하여 초기 번들 크기를 줄이고 필요한 화면만 지연 로딩합니다.
- **폼 상태 책임 분리:** Category, Milestone, Task 폼의 초기화·제출·삭제 흐름은 feature 전용 훅에서 관리하고 모달 컴포넌트는 UI 조립에 집중합니다.

---

## 📔 Tech Stack

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Core** | ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) | UI 라이브러리 및 언어 |
| **Build** | ![Vite](https://img.shields.io/badge/Vite-8.x-purple) | 빌드 도구 및 빠른 HMR |
| **State** | React Hooks, **Zustand** | 캘린더 로컬/서버 응답 상태, 마이페이지 프로필 편집 상태 |
| **Network** | **Axios** | HTTP 비동기 통신 |
| **Style** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC) | 디자인 토큰 기반 유틸리티 CSS |
| **Routing** | **React Router DOM** | SPA 라우팅 |
| **Image** | **react-easy-crop** | 프로필/카테고리 이미지 크롭 UI |
| **Chart / Export** | **Chart.js**, **react-chartjs-2**, **html-to-image** | 리포트 차트 렌더링 및 이미지 저장 |
| **Icons** | **lucide-react**, SVG React Component | 공용 아이콘 및 서비스 전용 SVG |
| **Pkg Mgr** | **npm** | 패키지 매니저 |
| **Quality** | oxlint, TypeScript, Vitest, GitHub Actions | 코드 품질, 타입·핵심 로직 테스트, 프로덕션 빌드 자동 검증 |

## ⚙️ Prerequisites (사전 요구 사항)

원활한 프로젝트 실행을 위해 아래의 환경이 세팅되어 있어야 합니다.

- **Node.js:** `v20.x` (LTS) 이상
- **npm:** `v10.x` 이상
> **Tip:** 팀원 간 노드 버전을 통일하기 위해 [NVM(Node Version Manager)](https://github.com/nvm-sh/nvm) 사용을 적극 권장합니다. 터미널에서 `nvm use 20` 명령어로 버전을 맞춰주세요.

<br/>

## Getting Started (설치 및 실행)

### 1. 프로젝트 클론
```bash
git clone git@github.com:umc-pebble/Pebble-Frontend.git
cd Pebble-Frontend
```

### 2. 패키지 설치
```bash
cd Pebble
npm install
```
> 팀원들과 정확히 동일한 의존성 버전을 설치하려면 `npm ci`를 권장합니다.

### 3. 환경 변수 설정
Pebble 폴더 디렉토리에 `.env.local` 파일을 생성하고 서버 및 소셜 로그인 키 값을 입력하세요.
공유 가능한 기본 예시는 `Pebble/.env.example`을 참고합니다.

```env
VITE_API_BASE_URL=https://pebble.it.kr/api/v1
VITE_GOOGLE_CLIENT_ID=
VITE_NAVER_CLIENT_ID=
```
로컬과 배포 환경(Vercel)은 동일한 키 이름을 사용하며, 실제 Client ID는 저장소에 커밋하지 않습니다.

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속하여 화면을 확인합니다.

<br/>

## 📂 Project Structure (폴더 구조)

Pebble 프론트엔드는 유지보수와 협업 효율을 극대화하기 위해 **기능(Feature) 중심 아키텍처**를 채택했습니다.

```text
Pebble/src/
├── assets/              # 아이콘, 이미지 등 정적 리소스
├── components/          # 도메인 종속성이 없는 공용 UI / 레이아웃
│   ├── feedback/        # 전역 오류 토스트 및 네트워크 상태 처리
│   ├── layout/          # GNB, MainLayout, 공통 뷰포트 훅
│   ├── theme/           # 사용자 테마 초기화
│   └── ui/              # 공용 모달, 버튼, 날짜 선택기, 이미지 크롭
│       ├── image-crop/  # 프로필·카테고리 이미지 크롭
│       └── schedule-date-picker/ # 날짜 유형·월간 달력 UI
│
├── types/               # 전역 공통 타입 정의 (Category, Milestone, Task 등)
│
├── hooks/               # 도메인에 종속되지 않는 재사용 커스텀 훅
├── utils/               # 날짜, 색상 토큰 등 순수 유틸리티 함수
├── services/            # API client, auth token, 공통 응답/에러 타입
│
├── features/            # 핵심 비즈니스 도메인
│   ├── auth/            # 일반·소셜 로그인 (구글, 네이버), 회원가입
│   ├── calendar/        # 캘린더 상태 모델, 컨텍스트, 페이지 조립용 컴포넌트/유틸
│   │   ├── components/  # 데스크톱·모바일 캘린더 및 공유 폼/선택 UI
│   │   ├── context/     # MainLayout과 캘린더 페이지가 공유하는 상태 컨텍스트
│   │   ├── hooks/       # 상태 조립, 도메인 액션, 사이드바 편집 상태
│   │   ├── services/    # 월별·사용자별 캘린더 데이터 조회 및 조합
│   │   └── utils/       # 캘린더 상태 변경 순수 함수
│   ├── category/        # 카테고리 CRUD, 색상 선택, 이미지/멤버 UI/API
│   │   ├── api/         # 카테고리, 친구 목록, 이미지 업로드 API 및 mapper
│   │   ├── components/  # 카테고리 화면 및 모달 컴포넌트
│   │   ├── hooks/       # 상세·폼 멤버 상태 및 비동기 흐름
│   │   └── utils/       # 변경 필드 계산 및 멤버 변환 순수 함수
│   ├── milestone/       # 마일스톤 관리 및 캘린더/사이드바 UI/API
│   │   ├── api/         # 마일스톤 API, 응답 타입, mapper
│   │   ├── components/  # CalendarBoard, 아코디언, 상세 UI
│   │   └── hooks/       # 마일스톤 폼 상태 및 제출 흐름
│   ├── task/            # 태스크 생성, 편집, 체크 UI/API
│   │   ├── api/         # 독립 태스크/하위 태스크 API, 응답 타입, mapper
│   │   ├── components/  # 태스크 폼, 단일 태스크 섹션 등
│   │   ├── hooks/       # 태스크 폼 상태 및 관계 선택 흐름
│   │   └── utils/       # 태스크 완료 여부 계산
│   ├── activity/        # 사용자 활동 조회 API와 날짜별 활동 변환
│   ├── home/            # 내·친구 캘린더 전환, 프로필 스트립 및 활동 요약
│   ├── friends/         # 친구 관계 API와 동기화 유틸
│   ├── mypage/          # 마이페이지 프로필, 사용자 활동 UI 및 Zustand 스토어
│   ├── alarm/           # 알림 목록, 상태 및 API
│   ├── grass/           # 잔디밭 컴포넌트 및 로직
│   ├── landing/         # 랜딩 페이지 섹션 및 훅
│   ├── report/          # 월말 리포트 조회, 차트 및 이미지 저장
│   └── settings/        # 설정 화면 섹션 및 토글/세그먼트 컴포넌트
│
├── pages/               # 라우팅 진입점 (features 조합)
│   ├── calendar/        # 메인 캘린더 페이지
│   ├── friends/         # 친구 관리 페이지
│   ├── home/            # 내·친구 캘린더 홈
│   ├── landing/         # 랜딩 페이지
│   ├── mypage/
│   └── settings/        # 설정 및 이메일 인증 페이지
│
├── styles/              # 전역 스타일 (index.css, CSS Variables)
└── App.tsx
```

### 개발 원칙
1. **Colocation:** 특정 도메인(예: task)에서만 쓰이는 컴포넌트와 훅은 `features/task/` 내부에 응집시킵니다.
2. **Shared UI First:** 버튼, 모달 액션, 날짜 선택기처럼 도메인 지식이 없는 UI는 `components/ui/`에 둡니다.
3. **Feature Shared Layer:** 여러 캘린더 하위 도메인(category/milestone/task)이 함께 쓰는 타입, 선택 UI, 상태 유틸은 `features/calendar/`에 둡니다.
4. **API Layer 분리:** API 요청, 응답 타입, mapper는 각 feature의 `api/` 폴더에 두고, 공통 client만 `services/api/`에서 관리합니다.
5. **Pure Utils:** 날짜 포맷, 색상 파생 계산처럼 화면 상태와 무관한 함수는 `utils/`에 둡니다.
6. **Absolute Import:** 상대 경로(`../../`) 대신 `@/features/...` 형태의 절대 경로를 사용합니다.

<br/>

## Contribution Guide (협업 규칙)

### 1. Git Flow 및 브랜치 전략
- `main`: 실제 배포되는 프로덕션 버전
- `develop`: 개발 및 통합 중인 코드 (PR 대상)

**📌 브랜치 명명 규칙: `타입/기능명_닉네임`**
<br/>
누가 작업 중인지 명확히 알기 위해 기능명 뒤에 작성자 이름(이니셜이나 닉네임)을 붙입니다.

| 타입 | 설명 | 사용 예시 |
| :--- | :--- | :--- |
| `feat` | 새로운 기능 추가 | `feat/grass_Elric` |
| `fix` | 버그 및 에러 수정 | `fix/task-scroll_Elric` |
| `design` | UI/CSS 퍼블리싱 및 스타일 변경 | `design/main-color_Elric` |
| `refactor` | 비즈니스 로직 및 코드 리팩토링 | `refactor/api-logic_Elric` |
| `docs` | README 등 문서 수정 | `docs/readme_Elric` |

### 1-1. 이슈 생성 기준
- `feat`, `design`, `refactor`, `docs`처럼 기능 범위가 있거나 리뷰 맥락이 필요한 작업은 이슈를 먼저 생성하고 PR의 `관련 이슈`에 연결합니다.
- 단순 버그 수정인 `fix` 브랜치는 이슈 없이 PR을 올릴 수 있습니다.
- 이슈 없이 올리는 `fix` PR은 PR 본문 `관련 이슈`에 `없음 - 단순 버그 수정`처럼 사유를 명시합니다.
- 이미 머지된 PR 이후 누락된 수정이 발생하면 최신 `develop` 기준으로 별도 `fix/기능명_닉네임` 브랜치를 만들고, 해당 수정만 포함한 PR을 새로 올립니다.

### 2. Commit Convention
커밋 메시지는 **Conventional Commits**를 따르며 직관적으로 작성합니다.
- `feat: Category 렌더링 및 CRUD 로직 구현`
- `fix: Milestone 삭제 시 하위 Task 고아 객체 에러 수정`

### 3. Code Quality (PR 전 필수 확인)
원격 저장소에 Push 하거나 PR을 생성하기 전, 로컬에서 터미널을 통해 반드시 에러 여부를 점검합니다.

```bash
npm run type-check && npm run lint && npm run test && npm run build
```
- `type-check`: TypeScript 타입 불일치 검사
- `lint`: oxlint 기반 코드 컨벤션 및 미사용 변수 검사
- `test`: Vitest 기반 날짜·색상·일정 정렬 핵심 로직 회귀 검사
- `build`: 프로덕션 번들 및 Vercel 배포 가능 여부 검사

`pull_request`와 `develop` 브랜치 Push 시에도 GitHub Actions가 동일한 명령을 실행하여 병합 전 품질을 자동 검증합니다.

<br/>

## 🚀 PR 컨벤션 (Pull Request Convention)

### 1. PR 제목 규칙
**형식:** `태그: 작업 내용 요약 (#이슈번호)`

**예시:** `feat: 매칭 인터랙션 완결 및 카드 레이아웃 최적화 (#36)`

단순 `fix` PR처럼 연결 이슈가 없는 경우에는 이슈 번호를 생략할 수 있습니다.

**예시:** `fix: 이미지 크롭 영역 빈 공간 노출 방지`

| 태그 (Tag) | 설명 |
| :--- | :--- |
| **`feat`** | 새로운 기능 추가 |
| **`fix`** | 버그 수정 |
| **`refactor`** | 코드 리팩토링 (기능 변화 없음) |
| **`style`** | UI/CSS 스타일 변경, 포맷팅 |
| **`chore`** | 패키지 매니저, 빌드 설정 파일 수정 |
| **`docs`** | 문서(README, 노션 등) 수정 |

### 2. PR 본문 작성 규칙
`.github/PULL_REQUEST_TEMPLATE.md` 템플릿에 맞춰 아래 5가지 항목을 필수로 작성하여 리뷰어가 맥락을 쉽게 파악할 수 있도록 합니다.
1. **개요:** 핵심 작업 내용 2~3줄 요약
2. **주요 변경 사항:** 카테고리별 세부 수정 및 구현 내역
3. **테스트 결과:** 자체 테스트 완료 항목 체크리스트
4. **관련 이슈:** `Closes #이슈번호`로 자동 연동
5. **기타:** 브랜치명 및 시각 자료(캡처/GIF), 기타 참고 사항 기록

단순 `fix` PR처럼 연결 이슈가 없다면 `관련 이슈`에는 `없음 - 단순 버그 수정`을 작성합니다.

### 3. 코드 리뷰 규칙 (P-Rule)
리뷰 코멘트 작성 시 앞단에 우선순위 태그를 달아 작성자의 수정 부담을 줄이고 의도를 명확히 전달합니다.
- `[P1] 필수:` 버그, 아키텍처 규칙 위반 등 반드시 수정해야만 Merge 가능한 사항
- `[P2] 권장:` 더 나은 구현 방법 제안 (작성자가 합당한 이유가 있다면 수정하지 않아도 무방)
- `[P3] 단순 의견:` 코드에 대한 칭찬, 가벼운 제안 등 사소한 코멘트

### 4. 머지(Merge) 조건
- 팀원 중 최소 1명 이상의 `Approve`를 받아야 합니다.
- 본인 로컬 터미널에서 타입 체크, 린트, 빌드(`npm run type-check`, `npm run lint`, `npm run build`)를 통과해야 합니다.
- 모든 피드백 반영이 끝난 후, PR을 올린 본인이 직접 Merge하는 것을 원칙으로 합니다.

<br/>

## ⚠️ Troubleshooting (문제 해결)

**Q. `npm install` 시 의존성 충돌 에러(ERESOLVE)가 발생해요.**
> **A.** Node.js 버전 문제일 확률이 높습니다. 터미널에 `node -v`를 입력해 v20 이상인지 확인해 주세요. 버전이 맞는데도 안 된다면 `npm install --legacy-peer-deps`를 사용하거나, `npm cache clean --force` 후 다시 시도해 보세요.

**Q. VS Code에서 `import ... from '@/features/...'` 경로에 빨간 줄이 떠요.**
> **A.** VS Code가 TypeScript 설정을 즉각 반영하지 못해 생기는 문제입니다.
> 1. `Ctrl + Shift + P` (Mac: `Cmd + Shift + P`)를 눌러 명령 팔레트를 엽니다.
> 2. `TypeScript: Restart TS server`를 검색하여 실행해 주세요.

**Q. Tailwind CSS를 수정했는데 화면에 반영이 안 돼요.**
> **A.** Vite의 캐싱 문제일 수 있습니다. 실행 중인 서버를 끄고 `npm run dev -- --force` 명령어로 캐시를 초기화하며 다시 실행해 보세요.
