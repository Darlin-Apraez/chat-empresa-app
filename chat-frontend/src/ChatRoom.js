import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

export default function ChatRoom({ user }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 💡 Paso 1: Intentar unirse solo si el socket está listo.
    // Esto es redundante en la práctica, pero ayuda a veces.
    if (socket.connected) {
        socket.emit("userJoined", user);
    } else {
        // Opcional: Si no está conectado, escucha el evento de conexión
        socket.on('connect', () => {
            socket.emit("userJoined", user);
        }, { once: true }); // Asegura que solo se ejecute una vez
    }
    
    // 2. Definición y configuración de handlers
    const handleUsersList = (list) => setUsers(list);
    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleSystemMessage = (msg) => {
      // 💡 Paso 2: Usar un Set para prevenir duplicados en el cliente.
      // Esta es una solución de "último recurso" si el servidor falla.
      setMessages((prev) => {
        // Evita agregar el mismo mensaje de sistema consecutivamente
        const isDuplicate = prev.length > 0 && 
                            prev[prev.length - 1].system && 
                            prev[prev.length - 1].text === msg;
                            
        return isDuplicate ? prev : [...prev, { text: msg, system: true }];
      });
    };

    socket.on("usersList", handleUsersList);
    socket.on("chatMessage", handleChatMessage);
    socket.on("systemMessage", handleSystemMessage);

    // 3. Cleanup: Desactivar los listeners y, opcionalmente, la conexión
    return () => {
        socket.off("connect"); // Limpia el listener 'connect' si se usó
        socket.off("usersList", handleUsersList);
        socket.off("chatMessage", handleChatMessage);
        socket.off("systemMessage", handleSystemMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    let fileUrl = null;
    let fileName = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:4000/upload", formData);
      fileUrl = res.data.fileUrl;
      fileName = res.data.fileName;
    }

    const message = {
      name: user.name,
      area: user.area,
      text,
      fileUrl,
      fileName,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("chatMessage", message);
    setMessages((prev) => [...prev, message]);
    setText("");
    setFile(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Panel de usuarios */}
      <div className="w-64 bg-white p-4 border-r border-gray-300">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          Área: {user.area}
        </h2>
        <h3 className="font-medium text-gray-600 mb-2">Conectados:</h3>
        <ul className="space-y-1 text-gray-800">
          {users.map((u) => (
            <li key={u.socketId}>• {u.name}</li>
          ))}
        </ul>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-md ${msg.system
                ? "bg-gray-200 text-gray-600 italic mx-auto text-center"
                : msg.name === user.name
                  ? "bg-blue-100 self-end ml-auto"
                  : "bg-white border"
                }`}
            >
              {!msg.system && (
                <p className="font-semibold text-sm text-blue-600">
                  {msg.name}
                  <span className="text-xs text-gray-400 ml-2">
                    {msg.time}
                  </span>
                </p>
              )}
              {msg.text && <p>{msg.text}</p>}
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-sm text-blue-500 underline"
                >
                  📎 {msg.fileName}
                </a>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Envío de mensaje */}
        <form
          onSubmit={sendMessage}
          className="flex items-center gap-2 p-4 bg-white border-t"
        >
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 border p-2 rounded focus:outline-blue-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-10 h-10 object-cover rounded-md border"
            />
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
