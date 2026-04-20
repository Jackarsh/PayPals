import React, { useEffect, useState } from "react";
import API from "../api";

export default function Activity() {

    const [groups, setGroups] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [items, setItems] = useState([]);

    useEffect(() => {
        API.get("/groups").then(r => setGroups(r.data));
    }, []);

    const load = async (id) => {
        if (!id) return;
        const res = await API.get(`/api/activity/${id}`)
        setItems(res.data);
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Activity Feed</h2>

                <select value={groupId} onChange={(e) => {
                    setGroupId(e.target.value);
                    load(e.target.value);
                }}>
                    <option value="">Select group</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name} (ID: {g.id})</option>
                    ))}
                </select>

                <div style={{ marginTop: 20 }}>
                    {items.map((a, idx) => (
                        <div key={idx} style={{
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.05)"
                        }}>
                            <strong>{a.text}</strong>
                            <div className="small" style={{ opacity: 0.7 }}>
                                {new Date(a.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {groupId && items.length === 0 && (
                        <p className="small">No activity yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
