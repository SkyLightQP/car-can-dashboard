# Car Can Dashboard

[car-can-collector](https://github.com/SkyLightQP/car-can-collector)가 수집한 차량 데이터를 보여주는 웹 대시보드

## 요구 사항

- Node.js 24
- pnpm
- 실행 중인 car-can-collector 서버와 로그인 계정. 계정 만드는 방법은 collector README의 "로그인 계정 만들기"를 참고하세요.

## 환경 변수

`.env.example`을 `.env`로 복사한 뒤 값을 채웁니다.

| 변수                           | 설명                                                                                                                               |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `COLLECTOR_TRPC_URL`           | collector tRPC 주소. 기본값: `http://localhost:3000/trpc`                                                                          |
| `COLLECTOR_AUTH_URL`           | collector 로그인 API 주소. 기본값: `http://localhost:3000/auth`                                                                    |
| `DASHBOARD_ORIGIN`             | 이 대시보드에 접속하는 주소. collector `.env`의 `TRUSTED_ORIGINS`에 같은 값이 있어야 로그인됩니다. 기본값: `http://localhost:5173` |
| `VEHICLE_MODEL`                | 화면에 표시할 차량 모델명                                                                                                          |
| `VEHICLE_PLATE_NUMBER`         | 화면에 표시할 번호판                                                                                                               |
| `VEHICLE_RECOMMENDED_TIRE_PSI` | 타이어 권장 공기압(psi). 기본값: 35                                                                                                |
| `PORT`                         | 선택                                                                                                                               |

## 시작하기

```bash
pnpm install
pnpm run dev             # 개발 모드, http://localhost:5173
```

```bash
pnpm run build
pnpm run start           # build/ 결과물 실행
```

- `pnpm run dev`는 `.env`를 자동으로 읽지만 `pnpm run start`는 읽지 않습니다. 운영 환경에서는 환경 변수를 셸이나 실행 환경에서 직접 지정하세요.
- collector도 기본 포트가 3000이므로, 같은 서버에서 띄울 때는 `PORT`를 다른 값으로 지정하세요.
- `NODE_ENV=production`이면 로그인 쿠키에 `Secure`가 붙어 HTTPS에서만 로그인이 유지됩니다.

## collector 타입 동기화

tRPC 타입은 collector에서 만들어 `app/types/collector/`에 복사해 둔 파일을 씁니다. collector의 라우터나 스키마가 바뀌면 collector 폴더에서 아래 명령을 실행한 뒤, 바뀐 `app/types/collector/`를 이 저장소에 커밋하세요.

```bash
pnpm run sync:types
```

## 개발

```bash
pnpm run typecheck       # 라우트 타입 생성 + tsc
pnpm run lint            # eslint
pnpm run format          # prettier
```
