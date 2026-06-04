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
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        style={{
          ...styles.button,

          opacity:
            currentPage === 1
              ? 0.5
              : 1,
        }}
      >
        Prev
      </button>

      {[...Array(totalPages)].map(
        (_, index) => (

          <button
            key={index}

            onClick={() =>
              onPageChange(index + 1)
            }

            style={
              currentPage ===
              index + 1

                ? styles.activeButton

                : styles.button
            }
          >
            {index + 1}
          </button>
        )
      )}

      <button
        disabled={
          currentPage === totalPages
        }

        onClick={() =>
          onPageChange(currentPage + 1)
        }

        style={{
          ...styles.button,

          opacity:
            currentPage ===
            totalPages
              ? 0.5
              : 1,
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
    background: "#e2e8f0",
    color: "#1e293b",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    minWidth: "42px",
  },

  activeButton: {
    border: "none",
    background: "#6080E8",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    minWidth: "42px",
    boxShadow:
      "0 4px 12px rgba(96,128,232,0.35)",
  },
};