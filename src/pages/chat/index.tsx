import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  sender: string;
}

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = prompt("이름을 입력해주세요:") || "익명";
    setUsername(name);

    const socketInitializer = async () => {
      await fetch("/api/socket");
      const socket = io({
        path: "/api/socket",
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.on("message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      setSocket(socket);
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && socket) {
      const message: Message = {
        id: Date.now().toString(),
        text: messageInput,
        sender: username,
      };
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">실시간 채팅</h1>
        <div className="h-96 overflow-y-auto mb-4 border rounded p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 ${
                message.sender === username ? "text-right" : "text-left"
              }`}
            >
              <span className="text-sm text-gray-500">{message.sender}</span>
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="메시지를 입력하세요..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}
