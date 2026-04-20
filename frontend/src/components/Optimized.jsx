import React, { useEffect, useState } from "react";
import API from "../api";

export default function Optimized() {

  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [optimized, setOptimized] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all groups initially
  useEffect(() => {
    API.get("/groups")
      .then(res => setGroups(res.data))
      .catch(console.error);
  }, []);

  // Fetch optimized settlements for group
  const loadOptimized = async (id) => {
    if (!id) return;
    setLoading(true);

    try {
      const res = await API.get(`/balances/group/${id}/optimized`);
      setOptimized(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load optimized settlements.");
    }

    setLoading(false);
  };

  // Perform SETTLE UP action
  const handleSettle = async (line) => {
    // Example line: "Aditya pays Utkarsh ₹65.00"
    const parts = line.split(" ");

    const payerName = parts[0];
    const receiverName = parts[2];
    const amount = parts[3].replace("₹", "").trim();

    // Find user IDs by name (case-insensitive match)
    const findUserIdByName = (name) => {
      for (let g of groups) {
        // This ONLY gives group ID, not user ID
        // So instead, we depend on /users endpoint
      }
    };

    // Fetch user list (needed for mapping name → ID)
    const usersRes = await API.get("/users");
    const users = usersRes.data;

    const payer = users.find(u => u.name.toLowerCase() === payerName.toLowerCase());
    const receiver = users.find(u => u.name.toLowerCase() === receiverName.toLowerCase());

    if (!payer || !receiver) {
      alert("Could not find payer/receiver IDs.");
      return;
    }

    try {
      // 1. Save the settlement expense
      await API.post("/settle", {
        groupId,
        payer: payer.id,
        receiver: receiver.id,
        payerName,
        receiverName,
        amount
      });

      // 2. Log activity
      await API.post("/api/activity", {
        groupId,
        text: `${payerName} settled ₹${amount} with ${receiverName}`
      });

      alert("Settlement completed!");
      loadOptimized(groupId);

    } catch (err) {
      console.error(err);
      alert("Failed to settle.");
    }
  };


  return (
    <div className="container">
      <div className="card">
        <h2>Optimized Settlements</h2>

        {/* SELECT GROUP */}
        <select
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value);
            loadOptimized(e.target.value);
          }}
        >
          <option value="">Select Group</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>
              {g.name} (ID: {g.id})
            </option>
          ))}
        </select>

        {loading && <p style={{ marginTop: 18 }}>Loading...</p>}

        {/* SHOW SETTLEMENTS */}
        {optimized.length > 0 && !loading && (
          <div style={{ marginTop: 25 }}>
            <h3>Recommended Minimal Transactions</h3>

            {optimized.map((line, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px 16px",
                  marginBottom: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,255,190,0.13)", // glowing green card
                  color: "#00ffbf",
                  fontWeight: 600,
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                {line}

                <button
                  className="btn outline"
                  onClick={() => handleSettle(line)}
                  style={{ marginLeft: 15 }}
                >
                  Settle Up
                </button>
              </div>
            ))}
          </div>
        )}

        {/* If no transactions required */}
        {groupId && optimized.length === 0 && !loading && (
          <p className="small" style={{ marginTop: 20 }}>
            No settlements needed — everyone is settled.
          </p>
        )}
      </div>
    </div>
  );
}
