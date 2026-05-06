# TradingView MCP Workspace Instructions

## 운영 학습 자동 누적 규칙
- 이 작업 폴더에서 반복될 가능성이 높은 해결법, 명령, 우회 경로, 실패 원인을 새로 확인하면 사용자가 따로 지시하지 않아도 이 `AGENTS.md`에 짧게 추가한다.
- 추가 대상은 실제로 검증한 내용만이다. 추측, 일회성 임시값, 비밀번호/토큰/쿠키 같은 민감정보는 절대 기록하지 않는다.
- 기록은 문제 증상 -> 바로 쓸 명령/절차 -> 주의점 순서로 남긴다. 너무 길게 설명하지 말고 다음 세션의 내가 바로 따라 할 수 있게 쓴다.
- 이런 업데이트는 사전에 매번 허락받지 않고 수행한다. 대신 완료 후 어떤 항목을 추가했는지만 사용자에게 짧게 사후 통보한다.
- 기존 상위 `AGENTS.md` 지침과 충돌하면 상위 고정 규칙, 보안 규칙, 사용자 최신 지시를 우선한다.

## 운영 학습 로그

### Pine Script 소스 읽기
- 증상: TradingView MCP에서 Pine Script 소스가 Monaco DOM/textarea 일부만 보이거나 비동기 `ui_evaluate`가 `{}`처럼 빈 결과를 반환할 수 있다.
- 확인된 해결법: 이 작업 폴더의 `tradingview-mcp`에서 `node scripts/pine_pull.js`를 실행하면 현재 열린 Pine Editor 소스를 `scripts/current.pine`로 가져올 수 있다.
- 추천 절차:
  1. TradingView에서 대상 지표의 `Source code`를 열어 Pine Editor가 보이게 한다.
  2. `cd /Users/hyunseo/MCP/test/260506_claude_tradingview/tradingview-mcp`
  3. `node scripts/pine_pull.js`
  4. `scripts/current.pine`를 `sed`/`rg`로 읽어 로직을 분석한다.
- 주의: DOM에서 보이는 줄만 긁으면 가상 스크롤 때문에 누락될 수 있다. 전체 로직 확인은 `pine_pull.js` 결과를 기준으로 한다.
