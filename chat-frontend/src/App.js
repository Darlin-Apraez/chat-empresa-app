import React, { useState } from "react";
import ChatRoom from "./ChatRoom";

export default function App() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [area, setArea] = useState("Litigios");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUser({ name, area });
    }
  };

  const handleLogout = () => {
    setUser(null);
    console.log("Sesión cerrada. Volviendo al Login.");
  };

  if (user) {
    return <ChatRoom user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          💼 Chat Empresarial
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Tu nombre..."
            className="border p-2 rounded focus:outline-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border p-2 rounded focus:outline-blue-400"
          >
            <option value="Litigios">Litigios</option>
            <option value="Contratación">Contratación</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar al Chat
          </button>
        </form>
      </div>
    </div>
  );
}
