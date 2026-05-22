import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AuthWatcher() {

  useEffect(() => {
    const interval = setInterval(() => {

      const token = localStorage.getItem("access");

      // ❌ If already on login page → do nothing
      if (window.location.pathname === "/") {
        return;
      }

      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.clear();
          window.location.href = "/";
        }

      } catch {
        localStorage.clear();
        window.location.href = "/";
      }

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return null;
}