import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { switchContract } from "../api/dashboard";

const BASE = import.meta.env.VITE_API_BASE;

function ContractCard({ contract, refresh }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [switching, setSwitching] = useState(false);

  // Safety guard
  if (!contract) return null;

  const riskColor =
    contract.riskLevel === "HIGH"
      ? "#ff4d4f"
      : contract.riskLevel === "MEDIUM"
      ? "#faad14"
      : "#52c41a";

  useEffect(() => {
    if (!contract.id) return;
    if (contract.riskLevel === "LOW") return;

    async function fetchRecommendation() {
      try {
        setLoadingRec(true);

        const res = await fetch(
          `${BASE}/recommendation/${contract.id}`
        );

        if (!res.ok) {
          throw new Error("Recommendation failed");
        }

        const data = await res.json();
        setRecommendation(data);
      } catch (err) {
        console.error("Recommendation fetch failed:", err.message);
        setRecommendation(null);
      } finally {
        setLoadingRec(false);
      }
    }

    fetchRecommendation();
  }, [contract.id, contract.riskLevel]);

  async function handleSwitch() {
    if (!recommendation || !contract.id) return;

    try {
      setSwitching(true);

      await switchContract(
        contract.id,
        recommendation.potentialSavings || 0
      );

      if (refresh) {
        await refresh();
      }
    } catch (err) {
      console.error("Switch failed:", err.message);
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        padding: "16px",
        marginTop: "12px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <strong style={{ fontSize: "16px" }}>
        {contract.vendor}
      </strong>

      <p>Renews in {contract.daysLeft} days</p>
      <p>Current Price: ₹{contract.renewalAmount}</p>

      <span
        style={{
          padding: "4px 12px",
          borderRadius: "20px",
          background: riskColor,
          color: "white",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        {contract.riskLevel}
      </span>

      {/* ---------------- Recommendation UI ---------------- */}
      {loadingRec && (
        <p style={{ marginTop: "10px", color: "#007bff" }}>
          Analyzing market options...
        </p>
      )}
      {recommendation &&
        recommendation.potentialSavings > 0 && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "#f0f9ff",
              borderRadius: "8px",
            }}
          >
            <strong>
              Save ₹
              <CountUp
                end={recommendation.potentialSavings}
                duration={1}
              />
            </strong>

            <p style={{ margin: "4px 0" }}>
              Better option available at ₹
              {recommendation.bestAlternative}
            </p>

            <button
              onClick={handleSwitch}
              disabled={switching}
              style={{
                marginTop: "8px",
                padding: "8px 14px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                opacity: switching ? 0.7 : 1,
              }}
            >
              {switching
                ? "Switching..."
                : "Switch & Save"}
            </button>

            {/* Confidence Meter */}
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  height: "6px",
                  borderRadius: "4px",
                  background: "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width:
                      recommendation.confidence === "High"
                        ? "90%"
                        : "60%",
                    height: "100%",
                    background:
                      recommendation.confidence === "High"
                        ? "#22c55e"
                        : "#f59e0b",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>

              <small>
                Confidence:{" "}
                {recommendation.confidence || "Medium"}
              </small>
            </div>
          </div>
        )}
    </div>
  );
}

export default ContractCard;