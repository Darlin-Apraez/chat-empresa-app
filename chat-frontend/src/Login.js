import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && area.trim()) {
      onLogin({ name, area });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#f2f6fc",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1a3d7c",
            marginBottom: "10px",
          }}
        >
          💬 Chat Empresarial
        </h2>
        <p style={{ color: "#5f6368", marginBottom: "25px" }}>
          Ingresa tu nombre y selecciona tu área
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label
              htmlFor="name"
              style={{ fontWeight: "bold", color: "#1a3d7c" }}
            >
              Nombre:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border: "1px solid #cdd9f5",
                borderRadius: "8px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <label
              htmlFor="area"
              style={{ fontWeight: "bold", color: "#1a3d7c" }}
            >
              Área:
            </label>
            <select
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                border: "1px solid #cdd9f5",
                borderRadius: "8px",
                outline: "none",
                fontSize: "14px",
                background: "#f8faff",
              }}
            >
              <option value="">Selecciona un área...</option>
              <option value="Contratación">Contratación</option>
              <option value="Litigios">Litigios</option>
              <option value="Financiera">Financiera</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Sistemas">Sistemas</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1a73e8",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#155cc0")}
            onMouseOut={(e) => (e.target.style.background = "#1a73e8")}
          >
            Ingresar al chat
          </button>
        </form>
      </div>
    </div>
  );
}
