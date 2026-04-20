import React, { useEffect, useState } from "react";
import API from "../api";
import { getUserName } from "../utils/userUtils";

export default function Balances({ users }) {

    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [summary, setSummary] = useState({});
    const [detailed, setDetailed] = useState([]);

    useEffect(() => {
        API.get("/groups").then(r => setGroups(r.data)).catch(console.error);
    }, []);

    const loadBalances = async (id) => {
        if (!id) return;

        try {
            const sum = await API.get(`/balances/group/${id}/summary`);
            const det = await API.get(`/balances/group/${id}/detailed`);

            setSummary(sum.data);
            setDetailed(det.data);
        } catch (e) {
            console.error(e);
            alert("Failed to load balances.");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Group Balances</h2>

                <select value={groupId} onChange={(e) => {
                    setGroupId(e.target.value);
                    loadBalances(e.target.value);
                }}>
                    <option value="">Select Group</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} (ID: {g.id})</option>
                    ))}
                </select>

                {groupId && (
                    <div style={{ marginTop: 20 }}>
                        <h3>Summary</h3>

                        {Object.keys(summary).length === 0 && (
                            <p className="small">No balances for this group.</p>
                        )}

                        {Object.entries(summary).map(([name, bal]) => (
                            <div
                                key={name}
                                style={{
                                    padding: "10px 14px",
                                    marginBottom: 10,
                                    borderRadius: 12,
                                    background:
                                        bal > 0
                                            ? "rgba(0,255,180,0.12)"
                                            : bal < 0
                                                ? "rgba(255,0,120,0.12)"
                                                : "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}
                            >
                                <strong>{name}</strong>
                                <span style={{ float: "right" }}>
                                    {bal > 0 && <span style={{ color: "#00ffaa" }}>+₹{bal.toFixed(2)}</span>}
                                    {bal < 0 && <span style={{ color: "#ff5588" }}>-₹{Math.abs(bal).toFixed(2)}</span>}
                                    {bal === 0 && <span style={{ color: "#ccc" }}>Settled</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {groupId && detailed.length > 0 && (
                    <div style={{ marginTop: 30 }}>
                        <h3>Detailed Settlements</h3>
                        <ul className="small">
                            {detailed.map((line, idx) => (
                                <li key={idx} style={{ margin: "6px 0" }}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
