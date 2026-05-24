import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // 🌟 Prevents the page from refreshing when submitting the form
    e.preventDefault(); 
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

      {/* LEFT SIDE: BRANDING LAYER */}
      <div style={styles.left}>
        <h1 style={styles.mainTitle}>Flying Colors Academy</h1>
        <p style={styles.descriptionText}>
          Master Abacus & Vedic Maths. <br />
          Empowering young minds with faster calculation skills.
        </p>
      </div>

      {/* RIGHT SIDE: FORM LAYER */}
      <div style={styles.right}>
        {/* 🌟 Wrapped in a form element to handle 'Enter' key submit actions natively */}
        <form onSubmit={handleLogin} style={styles.formWrapper}>
          <div style={styles.card}>

            <h2 style={styles.cardTitle}>Sign in</h2>

            <input
              type="text"
              placeholder="Username"
              required
              value={data.username}
              style={styles.input}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={data.password}
              style={styles.input}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />

            <button type="submit" style={styles.button}>
              Login
            </button>

          </div>
        </form>
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap", // 🌟 Allows components to break into stacked block segments smoothly on small displays
    minHeight: "100vh",
    width: "100%",
    background: "#0f172a",
    boxSizing: "border-box",
  },

  left: {
    flex: "1 1 400px", // 🌟 High fluid elasticity: grows equally, drops to next line when width drops past 400px
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
    textAlign: "left",
  },

  mainTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)", // 🌟 Fluid typography: shrinks dynamically on mobile without breakpoints
    fontWeight: "700",
    marginBottom: "15px",
    lineHeight: "1.2",
    color: "#ffffff",
  },

  descriptionText: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)", // 🌟 Fluid typography
    lineHeight: "1.6",
    opacity: 0.8,
    margin: 0,
  },

  right: {
    flex: "1 1 400px", // 🌟 Matches the same flex base parameters to keep an exact 50/50 split layout on web
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  formWrapper: {
    width: "100%",
    maxWidth: "400px", // Limits container growth on big web monitors
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    padding: "40px 30px",
    borderRadius: "14px",
    background: "#1e293b",
    color: "#fff",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },

  cardTitle: {
    fontSize: "1.8rem",
    marginBottom: "25px",
    fontWeight: "600",
    textAlign: "center",
    color: "#ffffff",
  },

  input: {
    width: "100%",
    padding: "13px 16px",
    marginBottom: "18px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "#6080E8", // Brand Blue
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background 0.2s ease, transform 0.1s ease",
    boxShadow: "0 4px 6px rgba(96, 128, 232, 0.2)",
    textAlign: "center",
  },
};