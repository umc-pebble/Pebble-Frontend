# 프로젝트 디자인 시스템 명세서

## 1.Color Themes (동적 테마 색상)
사용자가 앱 내에서 선택하는 감정/분위기 테마에 따라 실시간으로 변하는 테마 컬러입니다.

| Token | 신나는 (Exciting) | 팝아트 (Pop Art) | 가을 (Autumn) | 밤하늘 (Night) | 정원 (Garden) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Color-6.Base` | `#fd73af` | `#75f7fe` | `#feb16f` | `#7878da` | `#8fcd95` |
| `Color-5.Base` | `#ffdd47` | `#ff6bb5` | `#999f70` | `#dfb768` | `#fe867a` |
| `Color-4.Base` | `#f99d3d` | `#fffe00` | `#904551` | `#539d9a` | `#ebaee6` |
| `Color-3.Base` | `#ff7580` | `#f16f55` | `#e1b785` | `#596ca6` | `#84615e` |
| `Color-2.Base` | `#60d062` | `#3c4e85` | `#e16436` | `#3c4e85` | `#3c4e85` |
| `Color-1.Base` | `#00cef5` | `#755ecc` | `#967e6d` | `#755ecc` | `#755ecc` |
> *위의 Base 컬러 외에도 각각 Mid, Light 변형 컬러가 존재함.*

---

## 2.Typography (타이포그래피)
**기본 폰트:** Pretendard

| Token | Font Weight | Font Size | Line Height | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 01** | Bold (700) | `40px` | 130% | `text-heading-01` |
| **Heading 02** | Bold (700) | `32px` | 130% | `text-heading-02` |
| **Title 01_SB** | SemiBold (600) | `28px` | 130% | `text-title-01-sb` |
| **Title 01_M** | Medium (500) | `28px` | 130% | `text-title-01-m` |
| **Title 02_SB** | SemiBold (600) | `24px` | 130% | `text-title-02-sb` |
| **Title 02_M** | Medium (500) | `24px` | 130% | `text-title-02-m` |
| **Body 01_SB** | SemiBold (600) | `18px` | 150% | `text-body-01-sb` |
| **Body 01_M** | Medium (500) | `18px` | 150% | `text-body-01-m` |
| **Body 02_SB** | SemiBold (600) | `16px` | 150% | `text-body-02-sb` |
| **Body 02_M** | Medium (500) | `16px` | 150% | `text-body-02-m` |
| **Body 03_R** | Regular (400) | `14px` | 150% | `text-body-03-r` |
| **Caption 01** | Regular (400) | `13px` | 130% | `text-caption-01` |

---

## 3.Tokens (여백 및 테두리)

### Padding & Gap (여백)
| Token | Size (px) | Tailwind |
| :--- | :--- | :--- |
| **XS** | `4px` | `p-token-xs` / `gap-token-xs` |
| **S** | `8px` | `p-token-s` / `gap-token-s` |
| **M** | `12px` | `p-token-m` / `gap-token-m` |
| **L** | `20px` | `p-token-l` / `gap-token-l` |
| **XL** | `32px` / `40px`| `p-token-xl` / `gap-token-xl` |
| **XXL**| `40px` | `p-token-xxl` (Padding Only) |

### Radius (테두리 둥글기)
| Token | Size (px) | Tailwind |
| :--- | :--- | :--- |
| **XS** | `4px` | `rounded-token-xs` |
| **S** | `12px` | `rounded-token-s` |
| **M** | `20px` | `rounded-token-m` |
| **L** | `32px` | `rounded-token-l` |
| **Infinite**| `999px`| `rounded-token-infinite` |