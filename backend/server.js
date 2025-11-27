import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

// ==== CONFIGURACIÓN EXPRESS ====
const app = express();
app.use(cors());
app.use(express.json());

// 📁 Crear carpeta uploads si no existe
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ==== CONFIGURAR MULTER ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 📤 Ruta para subir archivos
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
  const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ fileUrl, fileName: req.file.originalname });
});

// Servir archivos subidos
app.use("/uploads", express.static(uploadDir));

// ==== SERVIDOR HTTP Y SOCKET.IO ====
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// ==== USUARIOS CONECTADOS ====
let users = [];

io.on("connection", (socket) => {
  socket.on("userJoined", (user) => {
    const newUser = {
      name: user.name,
      area: user.area,
      socketId: socket.id,
    };

    let userWasAdded = false; // Bandera para saber si se agregó

    // Evitar duplicados por socketId
    if (!users.some((u) => u.socketId === socket.id)) {
      users.push(newUser);
      userWasAdded = true; // El usuario se agregó
    }

    io.emit("usersList", users);

    // 💡 CAMBIO CLAVE: Solo enviar el mensaje del sistema si el usuario fue agregado realmente
    if (userWasAdded) {
      io.emit("systemMessage", `${user.name} se ha unido al chat`);
    }
  });

  socket.on("chatMessage", (msg) => {
    // Envía el mensaje a todos los demás sockets conectados, excluyendo al emisor.
    socket.broadcast.emit("chatMessage", msg);
  });

  // Eliminar usuario al desconectar
  socket.on("disconnect", () => {
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("usersList", users);
    // Nota: Opcionalmente, podrías emitir un "se ha desconectado" aquí.
  });
});

const PORT = 4000;
server.listen(PORT, () =>
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
);
