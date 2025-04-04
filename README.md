# Next.js 실시간 채팅 애플리케이션

Next.js와 Socket.IO를 사용하여 구현한 실시간 채팅 애플리케이션입니다.

## 기술 스택

- Next.js (Pages Router)
- TypeScript
- Socket.IO
- Tailwind CSS

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 웹소켓 통신 원리

### 1. 초기 연결 과정

클라이언트와 서버 간의 웹소켓 연결은 다음과 같은 순서로 이루어집니다:

1. HTTP 엔드포인트를 통한 Socket.IO 서버 초기화
2. 클라이언트에서 웹소켓 연결 시도

```typescript
// 클라이언트 측
const socketInitializer = async () => {
  await fetch("/api/socket"); // HTTP 엔드포인트 호출
  const socket = io({
    // 웹소켓 연결 시도
    path: "/api/socket",
  });
};
```

### 2. 서버 측 설정

서버는 Socket.IO 인스턴스를 생성하고 Next.js 서버에 연결합니다:

```typescript
// 서버 측
const io = new SocketIOServer(res.socket.server, {
  path: "/api/socket",
  addTrailingSlash: false,
});
res.socket.server.io = io; // 서버 인스턴스에 Socket.IO 저장
```

### 3. 실시간 통신 방식

메시지 전송 및 수신은 이벤트 기반으로 동작합니다:

```typescript
// 서버 측
io.on("connection", (socket) => {
  socket.on("message", (message) => {
    io.emit("message", message); // 모든 클라이언트에게 브로드캐스트
  });
});

// 클라이언트 측
socket.on("message", (message: Message) => {
  setMessages((prev) => [...prev, message]); // 메시지 수신 및 상태 업데이트
});
```

### 4. 주요 특징

- **이벤트 기반 통신**: `socket.emit()`과 `socket.on()`을 사용한 이벤트 기반 메시지 전송
- **자동 연결 관리**:
  - WebSocket을 우선적으로 사용
  - WebSocket이 사용 불가능한 환경에서는 HTTP Long Polling으로 폴백
  - 네트워크 끊김 시 자동 재연결 시도
- **메모리 관리**: 컴포넌트 언마운트 시 웹소켓 연결 정리

### 5. 장점

- 실시간 양방향 통신 가능
- 서버와 클라이언트 간 지속적인 연결 유지
- HTTP 요청/응답 방식보다 효율적인 데이터 전송
- 자동 재연결 및 폴백 메커니즘으로 안정적인 통신 보장

## 기능

- 실시간 메시지 전송 및 수신
- 사용자 이름 설정
- 메시지 발신자 구분 (자신/다른 사용자)
- 반응형 UI
