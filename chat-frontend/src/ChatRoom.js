import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

// export default function ChatRoom({ user }) {

//   if (!user || !user.name || !user.area) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100">
//         <p className="text-xl font-semibold text-gray-600 p-8 bg-white rounded-lg shadow-xl">
//           Cargando sesión o sesión terminada.
//         </p>
//       </div>
//     );
//   }

//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     // 💡 Paso 1: Intentar unirse solo si el socket está listo.
//     // Esto es redundante en la práctica, pero ayuda a veces.
//     if (socket.connected) {
//       socket.emit("userJoined", user);
//     } else {
//       // Opcional: Si no está conectado, escucha el evento de conexión
//       socket.on('connect', () => {
//         socket.emit("userJoined", user);
//       }, { once: true }); // Asegura que solo se ejecute una vez
//     }

//     // 2. Definición y configuración de handlers
//     const handleUsersList = (list) => setUsers(list);
//     const handleChatMessage = (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     };
//     const handleSystemMessage = (msg) => {
//       // 💡 Paso 2: Usar un Set para prevenir duplicados en el cliente.
//       // Esta es una solución de "último recurso" si el servidor falla.
//       setMessages((prev) => {
//         // Evita agregar el mismo mensaje de sistema consecutivamente
//         const isDuplicate = prev.length > 0 &&
//           prev[prev.length - 1].system &&
//           prev[prev.length - 1].text === msg;

//         return isDuplicate ? prev : [...prev, { text: msg, system: true }];
//       });
//     };

//     socket.on("usersList", handleUsersList);
//     socket.on("chatMessage", handleChatMessage);
//     socket.on("systemMessage", handleSystemMessage);

//     // 3. Cleanup: Desactivar los listeners y, opcionalmente, la conexión
//     return () => {
//       socket.off("connect"); // Limpia el listener 'connect' si se usó
//       socket.off("usersList", handleUsersList);
//       socket.off("chatMessage", handleChatMessage);
//       socket.off("systemMessage", handleSystemMessage);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);



//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!text && !file) return;

//     let fileUrl = null;
//     let fileName = null;

//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await axios.post("http://localhost:4000/upload", formData);
//       fileUrl = res.data.fileUrl;
//       fileName = res.data.fileName;
//     }

//     const message = {
//       name: user.name,
//       area: user.area,
//       text,
//       fileUrl,
//       fileName,
//       time: new Date().toLocaleTimeString(),
//     };

//     socket.emit("chatMessage", message);
//     setMessages((prev) => [...prev, message]);
//     setText("");
//     setFile(null);
//   };

//   const handleLogout = () => {
//     // 1. Notificar al servidor que el usuario se ha ido
//     socket.emit("userLeft", user);

//     // 2. Desconectar el socket
//     socket.disconnect();

//     // 3. Llamar a la función del componente padre para limpiar la sesión
//     if (onLogout) {
//       onLogout();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Panel de usuarios */}
//       <div className="w-64 bg-white p-4 border-r border-gray-300">
//         <h2 className="text-lg font-semibold text-blue-600 mb-4">
//           Área: {user.area}
//         </h2>
//         <h3 className="font-medium text-gray-600 mb-2">Conectados:</h3>
//         <ul className="space-y-1 text-gray-800">
//           {users.map((u) => (
//             <li key={u.socketId}>• {u.name}</li>
//           ))}
//         </ul>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="w-full mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
//         title="Desconecta del chat y cierra tu sesión"
//       >
//         Cerrar Sesión
//       </button>

//       {/* Chat principal */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-4 space-y-3">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`p-3 rounded-lg max-w-md ${msg.system
//                 ? "bg-gray-200 text-gray-600 italic mx-auto text-center"
//                 : msg.name === user.name
//                   ? "bg-blue-100 self-end ml-auto"
//                   : "bg-white border"
//                 }`}
//             >
//               {!msg.system && (
//                 <p className="font-semibold text-sm text-blue-600">
//                   {msg.name}
//                   <span className="text-xs text-gray-400 ml-2">
//                     {msg.time}
//                   </span>
//                 </p>
//               )}
//               {msg.text && <p>{msg.text}</p>}
//               {msg.fileUrl && (
//                 <a
//                   href={msg.fileUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block mt-2 text-sm text-blue-500 underline"
//                 >
//                   📎 {msg.fileName}
//                 </a>
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Envío de mensaje */}
//         <form
//           onSubmit={sendMessage}
//           className="flex items-center gap-2 p-4 bg-white border-t"
//         >
//           <input
//             type="text"
//             placeholder="Escribe un mensaje..."
//             className="flex-1 border p-2 rounded focus:outline-blue-400"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="text-sm"
//           />
//           {file && (
//             <img
//               src={URL.createObjectURL(file)}
//               alt="preview"
//               className="w-10 h-10 object-cover rounded-md border"
//             />
//           )}
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Enviar
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

export default function ChatRoom({ user, onLogout }) {
  
  // 1. DECLARACIÓN DE HOOKS (INCONDICIONALMENTE)
  // TODOS los Hooks deben declararse aquí, antes de cualquier 'return' condicional.
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  // 2. Configuración de Listeners del Socket y Join al chat
  useEffect(() => {
    // La lógica de socket solo debe ejecutarse si tenemos datos de usuario válidos.
    if (!user || !user.name || !user.area) return; 
    
    // Definición y configuración de handlers
    const handleUsersList = (list) => setUsers(list);
    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleSystemMessage = (msg) => {
      setMessages((prev) => {
        // Evita agregar el mismo mensaje de sistema consecutivamente
        const isDuplicate = prev.length > 0 &&
          prev[prev.length - 1].system &&
          prev[prev.length - 1].text === msg;

        return isDuplicate ? prev : [...prev, {
          text: msg,
          system: true
        }];
      });
    };

    // Intentar unirse solo si el socket está listo.
    const attemptJoin = () => {
      socket.emit("userJoined", user);
    };

    if (socket.connected) {
      attemptJoin();
    } else {
      // Si no está conectado, escucha el evento de conexión
      socket.on('connect', attemptJoin); 
    }

    socket.on("usersList", handleUsersList);
    socket.on("chatMessage", handleChatMessage);
    socket.on("systemMessage", handleSystemMessage);

    // Cleanup: Desactivar los listeners y, opcionalmente, la conexión
    return () => {
      socket.off("connect", attemptJoin);
      socket.off("usersList", handleUsersList);
      socket.off("chatMessage", handleChatMessage);
      socket.off("systemMessage", handleSystemMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Agregamos 'user' para re-ejecutar si el objeto user cambia


  // 3. Scroll al último mensaje 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);


  // 4. CLÁUSULA DE GUARDIA (RETORNO CONDICIONAL)
  // Esta debe ir DESPUÉS de la declaración de todos los Hooks.
  if (!user || !user.name || !user.area) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-xl font-semibold text-gray-600 p-8 bg-white rounded-lg shadow-xl">
                Cargando sesión o sesión terminada.
            </p>
        </div>
    );
  }
  
  // 5. Lógica de Envío de Mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    let fileUrl = null;
    let fileName = null;

    if (file) {
      // Subida de archivo (usando axios real)
      try {
        const formData = new FormData();
        formData.append("file", file);
        // NOTA: Asegúrate de que tu backend esté configurado para manejar la ruta /upload
        const res = await axios.post("http://localhost:4000/upload", formData); 
        fileUrl = res.data.fileUrl;
        fileName = res.data.fileName;
      } catch (error) {
        console.error("Error al subir el archivo:", error);
        // Si falla la subida, se detiene
        return; 
      }
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

  // 6. Lógica de Cierre de Sesión (Logout)
  const handleChatRoomLogout = () => {
    // 1. CORRECCIÓN: Notificar al servidor que el usuario se va antes de desconectar.
    // Esto asegura que otros usuarios vean la actualización de la lista.
    socket.emit("userLeft", user);

    // 2. Desconectar el socket
    socket.disconnect();

    // 3. Llamar a la función del componente padre (App) para limpiar la sesión
    if (onLogout) {
      onLogout();
    }
  };


  return (
    <div className="flex h-screen bg-gray-100 antialiased">
      {/* Panel de usuarios y control */}
      <div className="w-64 bg-white p-4 border-r border-gray-300 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-blue-700 mb-4 border-b pb-2">
            Sala de Chat
          </h2>
          <div className="mb-6 p-3 bg-blue-50 rounded-lg shadow-inner">
            <p className="text-sm font-semibold text-gray-800">
              Conectado como:
            </p>
            <p className="text-lg font-bold text-blue-600 truncate">
              {user.name}
            </p>
            <p className="text-sm font-medium text-gray-500">
              Área: {user.area}
            </p>
          </div>
          <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">
            <span className="text-blue-500 mr-1">●</span> Usuarios Conectados ({users.length}):
          </h3>
          <ul className="space-y-2 text-gray-800 overflow-y-auto max-h-[50vh]">
            {users.map((u) => (
              <li key={u.socketId} className="flex items-center text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {u.name}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Botón de Cierre de Sesión */}
        <button
          onClick={handleChatRoomLogout}
          className="w-full mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
          title="Desconecta del chat y cierra tu sesión"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Chat principal */}
      <div className="flex-1 flex flex-col">
        {/* Contenedor de Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.system
                ? "justify-center"
                : msg.name === user.name
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`p-3 rounded-xl max-w-lg shadow-md transition duration-150 ease-in-out ${msg.system
                  ? "bg-gray-200 text-gray-600 italic text-center text-sm"
                  : msg.name === user.name
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-tl-none"
                  }`}
              >
                {!msg.system && (
                  <p className={`font-bold text-sm mb-1 ${msg.name === user.name ? "text-blue-200" : "text-blue-700"}`}>
                    {msg.name}
                    <span className="text-xs ml-2 opacity-75">
                      {msg.time}
                    </span>
                  </p>
                )}
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                {msg.fileUrl && (
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block mt-2 text-sm underline font-medium ${msg.name === user.name ? "text-blue-200" : "text-blue-500"}`}
                  >
                    📎 {msg.fileName || "Archivo Adjunto"}
                  </a>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Envío de mensaje */}
        <form
          onSubmit={sendMessage}
          className="flex flex-col md:flex-row items-center gap-3 p-4 bg-white border-t border-gray-300 shadow-xl"
        >
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 w-full md:w-auto border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!socket.connected}
          />

          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              {file ? file.name.substring(0, 15) + '...' : 'Adjuntar'}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                title="Adjuntar Archivo"
              />
            </label>

            {file && (
              <div className="relative">
                <span className="text-sm text-gray-600 italic mr-2">{file.name}</span>
                <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                    title="Eliminar archivo adjunto"
                >
                    (X)
                </button>
              </div>
            )}
            
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-lg disabled:opacity-50"
              disabled={(!text && !file) || !socket.connected}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
