import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket이 이미 실행중입니다");
    res.end();
    return;
  }

  console.log("Socket 서버를 시작합니다");
  const io = new SocketIOServer(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("클라이언트가 연결되었습니다");

    socket.on("message", (message) => {
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("클라이언트 연결이 해제되었습니다");
    });
  });

  res.end();
};

export default SocketHandler;
