import React from "react";

export default function RecordViewer({
  isOpen,
  onClose,
  record,
  title = "Record Details",
}) {
  if (!isOpen || !record) return null;

  const hiddenFields = [
    "id",
    "password",
  ];

  const formatLabel = (text) => {
    return text
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Handles nested objects or arrays safely without breaking rendering loops
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "[Complex Data Object]";
      }
    }

    return String(value);
  };

  return (
    <>
      <div
        style={styles.overlay}
        onClick={onClose}
      />

      <div style={styles.drawer}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{title}</h2>
            <p style={styles.subtitle}>
              Complete Record Information
            </p>
          </div>

          <button
            onClick={onClose}
            style={styles.closeBtn}
          >
            &times;
          </button>
        </div>

        <div style={styles.content}>
          {Object.entries(record)
            .filter(([key]) => !hiddenFields.includes(key))
            .map(([key, value]) => (
              <div
                key={key}
                style={styles.fieldCard}
              >
                <div style={styles.label}>
                  {formatLabel(key)}
                </div>

                <div style={styles.value}>
                  {formatValue(value)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.65)", // Standardized backdrop depth mask balance
    zIndex: 1999,
  },

  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "450px",
    maxWidth: "100%",
    height: "100vh",
    background: "var(--bg-card)", // 👈 Variable
    borderLeft: "1px solid var(--border-main)", // 🌟 Frame separation highlight line
    zIndex: 2000,
    overflowY: "auto",
    boxShadow: "-25px 0 50px -12px rgba(0, 0, 0, 0.5)", // Smooth overlay shadows tracking
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px",
    borderBottom: "1px solid var(--border-main)", // 👈 Variable
    position: "sticky",
    top: 0,
    background: "var(--bg-card)", // 👈 Variable (Prevents content bleed-through on scroll)
    zIndex: 10,
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-main)", // 👈 Variable
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "var(--text-muted)", // 👈 Variable
  },

  closeBtn: {
    border: "none",
    background: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "var(--text-muted)", // 👈 Variable
    lineHeight: "1",
    padding: "0"
  },

  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  fieldCard: {
    padding: "12px",
    background: "var(--bg-layout)", // 👈 Variable
    border: "1px solid var(--border-main)", // 👈 Variable
    borderRadius: "8px",
  },

  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "var(--text-muted)", // 👈 Variable
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
  },

  value: {
    fontSize: "14px",
    color: "var(--text-td)", // 👈 Variable
    fontWeight: "500",
    wordBreak: "break-word",
  },
};