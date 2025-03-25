import { useEffect, useState, useRef } from "react";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(""); 
  const socket = useRef(null); 

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:3000");

    socket.current.onopen = () => {
      console.log("✅ WebSocket подключен");
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "history") {
        setMessages(message.data);
      } else if (message.type === "message") {
        setMessages((prev) => [...prev, { data: message.data }]);
      }
    };

    socket.current.onclose = () => {
      console.log("⚠️ WebSocket соединение закрыто");
    };

    socket.current.onerror = (error) => {
      console.error("❌ Ошибка WebSocket:", error);
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
      console.error("❌ WebSocket не инициализирован!");
      return;
    }

    if (input.trim() !== "") {
      const messageData = { data: input };
      socket.current.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md bg-white">
      <div className="h-64 overflow-y-auto mb-4 p-2 border rounded-md bg-gray-50">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.data} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={sendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;
