# Pebble Frontend
> **할 일은 가볍게, 마감은 확실하게. 맥락을 설계하는 계층형 여정 관리 투두리스트**

## 📢 프로젝트 소개 (Project Overview)
**Pebble(페블)**은 Category → Milestone → Task의 3단계 계층 구조를 통해 사용자가 지금 하는 일이 어떤 상위 목표를 위한 과정인지 한눈에 조망하고, 중요 데드라인을 놓치지 않으며 다음 행동을 자연스럽게 이어나갈 수 있도록 돕는 서비스입니다.

- **기획 배경:** 현대인의 할 일은 점점 복잡해지는데, 관리 도구는 여전히 단순한 ‘나열’에 머물러 있습니다. 수많은 프로젝트의 일정을 관리하기 위해 투두리스트에 '기간'을 억지로 기입하다 보면 발생하는 시각적 공해와 맥락 단절 현상을 해결하고자 합니다.
- **타겟 유저:** 
  - 주 타겟: 학업, 팀 프로젝트, 공모전 등 3개 이상의 일정을 동시에 수행하며 핵심 마감 관리에 어려움을 겪는 대학생 및 취준생
  - 부 타겟: 본업 외 사이드 프로젝트를 병행하는 주니어 N잡러
- **핵심 가치:** 
  - **할 일과 일정의 구조적 분리:** 오늘 할 일(Task)은 가볍게 나열하되, 프로젝트별 중요 일정(Milestone)은 캘린더 상에 독립된 이정표로 시각화합니다.
  - **계층 구조를 통한 맥락 부여:** 복잡한 세부 일정이 늘어나도 두꺼워지는 불편함 없이, 지금 하는 일이 어떤 목표의 일부인지 즉시 파악합니다.
  - **개인 최적화 에센셜 프로덕트:** 무거운 팀 협업 기능을 완전히 배제하고 직관적인 UI로 즉시 실행과 회고에만 몰입할 수 있습니다.

<br/>

## 👥 팀원 및 프론트엔드 역할 분담 (Team & Roles)

| 이름 | 역할 및 담당 도메인 | Github |
| :---: | :--- | :--- |
| **엘릭 / 심민식** | • 프론트엔드 팀장<br>• 깃허브 레포 초기 셋팅, 구조 설계 등 | [@minsik1014](https://github.com/minsik1014) |
| **심바 / 이채린** | • (추후 회의를 통해 담당 도메인 확정) | [@Chae102](https://github.com/Chae102) |
| **요나 / 오윤아** | • (추후 회의를 통해 담당 도메인 확정) | [@yoona24](https://github.com/yoona24) |
| **키위 / 윤규리** | • (추후 회의를 통해 담당 도메인 확정) | [@kiwi13ird](https://github.com/kiwi13ird) |

<br/>

## 📱 화면 목록 및 플로우 (Screen List & Flow)

| 화면명 (Screen) | 경로 (Path) | 주요 기능 및 설명 |
| :--- | :--- | :--- |
| **스플래시 / 로그인** | `/login` | • 소셜 로그인 연동(카카오, 구글) 및 신규 유저 온보딩 플로우 진입점 |
| **홈 (대시보드)** | `/` | • 현재 진행 중인 Milestone 및 Task 목록 조회<br>• 진행률 기반 프로그레스 바 및 캘린더 렌더링 |
| **소셜 (탐색)** | `/social` | • 닉네임#고유태그 기반 유저 검색, 상호 팔로우 및 활동 잔디밭 열람 |
| **마이페이지** | `/mypage` | • 사용자 프로필 관리 및 월말 결산 리포트(GIF) 확인 |
| **프리미엄** | `/premium` | • 구독 결제 플로우(월 990원) 및 멤버십 권한 관리 |

<br/>

## 🎨 Design System
-> **[프로젝트 디자인 시스템 명세서 (design.md) 바로가기](./design.md)**

<br/>

## Implementation Highlights
Pebble 프론트엔드는 데이터가 누적되어도 쾌적한 사용성을 유지하기 위해 **렌더링 최적화**와 **상태 관리**에 집중합니다.

* **트리 구조 상태 관리:** 하위 Task 완료 시 상위 Milestone의 진행률이 즉각적으로 자동 재계산되는 유기적인 상태 관리를 `Zustand`로 구현합니다.
* **렌더링 최적화 (Virtual Scroll):** 무한정 쌓일 수 있는 할 일 목록의 특성을 고려하여, `useMemo`와 가상 스크롤(Virtual Scroll) 기법을 도입해 브라우저 성능 저하(DOM 과부하)를 방지합니다.
* **디자인 시스템 연동:** 피그마의 동적 변수(Variables)를 `Tailwind CSS` 토큰으로 완벽하게 추출하여, 테마 전환 시 하드코딩 없이 즉각적이고 안정적인 UI 변경을 보장합니다.

---

## 📔 Tech Stack

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Core** | ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) | UI 라이브러리 및 언어 |
| **Build** | ![Vite](https://img.shields.io/badge/Vite-5.x-purple) | 빌드 도구 및 빠른 HMR |
| **State** | **Zustand** (Client), **TanStack Query** (Server) | 트리 구조 진행률 관리 및 서버 캐싱 |
| **Network** | **Axios** | HTTP 비동기 통신 |
| **Style** | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC) | 디자인 토큰 기반 유틸리티 CSS |
| **Routing** | **React Router DOM** | SPA 라우팅 |
| **Icons** | **lucide-react** | 경량 아이콘 라이브러리 |
| **Pkg Mgr** | **npm** | 패키지 매니저 |
| **Quality** | ESLint, Prettier | 코드 품질 및 포맷팅 |

<br/>

## ⚙️ Prerequisites (사전 요구 사항)

원활한 프로젝트 실행을 위해 아래의 환경이 세팅되어 있어야 합니다.

* **Node.js:** `v20.x` (LTS) 이상
* **npm:** `v10.x` 이상
> **Tip:** 팀원 간 노드 버전을 통일하기 위해 [NVM(Node Version Manager)](https://github.com/nvm-sh/nvm) 사용을 적극 권장합니다. 터미널에서 `nvm use 20` 명령어로 버전을 맞춰주세요.

<br/>

## Getting Started (설치 및 실행)

### 1. 프로젝트 클론
```bash
git clone git@github.com:Team-EL/Pebble-Frontend.git
cd Pebble-Frontend
```

### 2. 패키지 설치
```bash
cd Pebble
npm install
```
> 팀원들과 정확히 동일한 의존성 버전을 설치하려면 `npm ci`를 권장합니다.

### 3. 환경 변수 설정 (.env)
Pebble 폴더 디렉토리에 `.env` 파일을 생성하고 서버 및 소셜 로그인 키 값을 입력하세요.
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

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
│   ├── layout/          # GNB, Sidebar, AppLayout
│   └── ui/              # Button, Input, Modal (디자인 토큰 기반)
│
├── types/               # 전역 공통 타입 정의 (pebble.d.ts 등)
│
├── features/            # 핵심 비즈니스 도메인
│   ├── auth/            # 소셜 로그인 (카카오, 구글), 온보딩
│   ├── category/        # 카테고리 CRUD
│   ├── milestone/       # 마일스톤 관리 및 캘린더 UI
│   ├── task/            # 투두 생성, 체크, 가상 스크롤 렌더링
│   ├── grass/           # 잔디밭 컴포넌트 및 로직
│   └── report/          # 월말 리포트 (GIF 생성 및 열람)
│
├── pages/               # 라우팅 진입점 (features 조합)
│   ├── home/
│   ├── social/          # 팔로우 및 타 유저 잔디밭 열람
│   ├── mypage/
│   └── premium/         # 구독 결제 및 관리
│
├── store/               # 전역 클라이언트 상태 (usePebbleStore.ts)
├── hooks/               # 재사용 커스텀 훅 (useTheme, useVirtualScroll)
├── utils/               # 유틸리티 함수 (날짜 계산, 진행률 계산 로직)
├── styles/              # 전역 스타일 (index.css, CSS Variables)
└── App.tsx
```

### 개발 원칙
1. **Colocation:** 특정 도메인(예: task)에서만 쓰이는 컴포넌트와 훅은 `features/task/` 내부에 응집시킵니다.
2. **Absolute Import:** 상대 경로(`../../`) 대신 `@/features/...` 형태의 절대 경로를 사용합니다.

<br/>

## Contribution Guide (협업 규칙)

### 1. Git Flow 및 브랜치 전략
* `main`: 실제 배포되는 프로덕션 버전
* `develop`: 개발 및 통합 중인 코드 (PR 대상)

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

### 2. Commit Convention
커밋 메시지는 **Conventional Commits**를 따르며 직관적으로 작성합니다.
* `feat: Category 렌더링 및 CRUD 로직 구현`
* `fix: Milestone 삭제 시 하위 Task 고아 객체 에러 수정`

### 3. Code Quality (PR 전 필수 확인)
원격 저장소에 Push 하거나 PR을 생성하기 전, 로컬에서 터미널을 통해 반드시 에러 여부를 점검합니다.

```bash
npm run type-check && npm run lint
```
* `type-check`: TypeScript 타입 불일치 검사
* `lint`: ESLint 코드 컨벤션 및 미사용 변수 검사

<br/>

## 🚀 PR 컨벤션 (Pull Request Convention)

### 1. PR 제목 규칙
> **형식:** `태그: 작업 내용 요약 (#이슈번호)`
> *예시: `feat: 매칭 인터랙션 완결 및 카드 레이아웃 최적화 (#36)`*

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

### 3. 코드 리뷰 규칙 (P-Rule)
리뷰 코멘트 작성 시 앞단에 우선순위 태그를 달아 작성자의 수정 부담을 줄이고 의도를 명확히 전달합니다.
* **`[P1] 필수:`** 버그, 아키텍처 규칙 위반 등 반드시 수정해야만 Merge 가능한 사항
* **`[P2] 권장:`** 더 나은 구현 방법 제안 (작성자가 합당한 이유가 있다면 수정하지 않아도 무방)
* **`[P3] 단순 의견:`** 코드에 대한 칭찬, 가벼운 제안 등 사소한 코멘트

### 4. 머지(Merge) 조건
* 팀원 중 **최소 1명 이상의 `Approve`**를 받아야 합니다.
* 본인 로컬 터미널에서 타입 체크 및 린트(`npm run type-check`, `npm run lint`)를 통과해야 합니다.
* 모든 피드백 반영이 끝난 후, **PR을 올린 본인이 직접 Merge** 하는 것을 원칙으로 합니다.

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
