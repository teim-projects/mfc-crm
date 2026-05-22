// pages/Login.jsx
import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login/", data);
      localStorage.setItem("access", res.data.access);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1 style={styles.mainTitle}>Flying Colors Academy</h1>
        <p style={styles.descriptionText}>
          Master Abacus & Vedic Maths. <br />
          Empowering young minds with faster calculation skills.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <div style={styles.card}>

          <h2 style={styles.cardTitle}>Sign in</h2>

          <input
            placeholder="Username"
            style={styles.input}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#0f172a",
  },

  left: {
    flex: 1, // Even split
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
  },

  mainTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "15px",
    lineHeight: "1.2",
  },

  descriptionText: {
    fontSize: "1.25rem",
    lineHeight: "1.6",
    opacity: 0.8,
    margin: 0,
  },

  right: {
    flex: 1, // Even split
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "360px",
    padding: "40px",
    borderRadius: "12px",
    background: "#1e293b",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  },

  cardTitle: {
    fontSize: "1.8rem",
    marginBottom: "25px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "18px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "#6080E8", // Brand Blue
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "600",
    transition: "0.2s ease",
  },
};