export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={styles.container}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          ...styles.button,
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          style={
            currentPage === index + 1
              ? styles.activeButton
              : styles.button
          }
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          ...styles.button,
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Next
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "25px",
    flexWrap: "wrap",
  },
  button: {
    border: "none",
    background: "var(--bg-surface)", // 👈 Dynamic variable tokens integrated
    color: "var(--text-main)", // 👈 Dynamic variable tokens integrated
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    minWidth: "42px",
    transition: "all 0.2s ease",
  },
  activeButton: {
    border: "none",
    background: "#6080E8", // Accent core brand identity retained
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    minWidth: "42px",
    boxShadow: "0 4px 12px var(--shadow-light)", // 👈 Adaptive shadow matching depth rules
    transition: "all 0.2s ease",
  },
};