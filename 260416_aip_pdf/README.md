# AIP PDF Gateway PoC

읽기 전용 AIP PDF 관문 뷰어의 1차 기술검증 프로젝트입니다.

1차 범위는 회사 AIP 문서에 접근하지 않고 다음만 검증합니다.

- 데스크톱 앱 골격
- 일반 PDF 뷰어
- 읽기 전용 UX
- Microsoft 로그인 골격
- AIP 감지 자리
- 로컬 감사 로그

## 실행

```bash
pnpm install
pnpm start
```

## 테스트

```bash
pnpm test
```

## 1차 상태

현재 구현은 회사 협의 전 1차 기술검증 범위입니다.

- 일반 PDF는 PDF.js로 표시합니다.
- 보호 PDF 의심 파일은 열지 않고 차단합니다.
- Microsoft 로그인은 앱 승인 정보가 없으면 설정 필요 상태를 표시합니다.
- 저장, 인쇄, 다운로드, 복사 UX는 기본 비활성화되어 있습니다.
- 로컬 감사 로그는 앱 userData 하위 `logs/audit.jsonl`에 기록됩니다.
