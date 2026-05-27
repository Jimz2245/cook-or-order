export default function CostPanel({ estimate }) {
  if (!estimate || estimate.estimated_cost === 0) return null;

  return (
    <div
      style={{
        background: "#1a1a1a",
        color: "white",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        <p style={{ margin: "0 0 4px", opacity: 0.6, fontSize: "0.85rem" }}>
          Ordering {estimate.dish_name} instead would cost you
        </p>
        <p style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>
          ~${estimate.estimated_cost.toFixed(2)}
        </p>
        <p style={{ margin: "6px 0 0", opacity: 0.7, fontSize: "0.85rem" }}>
          {estimate.reasoning}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.5 }}>vs. making it yourself</p>
        <p style={{ margin: "4px 0 0", fontSize: "1.4rem", fontWeight: 700, color: "#4ade80" }}>
          ~$0–5
        </p>
      </div>
    </div>
  );
}
