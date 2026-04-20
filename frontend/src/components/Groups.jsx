import React, { useEffect, useState } from "react";
import API from "../api";

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [name, setName] = useState("");
    const [memberIdsText, setMemberIdsText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancel = false;
        setLoading(true);

        API.get("/groups")
            .then((res) => { if (!cancel) setGroups(res.data) })
            .catch(console.error)
            .finally(() => { if (!cancel) setLoading(false) });

        return () => { cancel = true };
    }, []);

    const createGroup = async () => {
        const memberIds = memberIdsText.split(",").map(n => parseInt(n.trim())).filter(Boolean);

        if (!name || memberIds.length === 0) {
            return alert("Enter group name + member IDs");
        }

        await API.post("/groups", { name, memberIds });
        setName("");
        setMemberIdsText("");

        const res = await API.get("/groups");
        setGroups(res.data);
    };

    return (
        <div className="container">

            <div className="card">
                <h2>Create New Group</h2>

                <input placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
                <input placeholder="Member IDs (comma separated)" value={memberIdsText} onChange={e => setMemberIdsText(e.target.value)} />

                <button className="btn" style={{ marginTop: 12 }} onClick={createGroup}>Create Group</button>
            </div>

            {loading && <div className="card small">Loading groups...</div>}

            {groups.map(g => (
                <div className="card" key={g.id}>
                    <h3>{g.name} <small style={{ color: "var(--muted)" }}>(ID: {g.id})</small></h3>

                    <p className="small">
                        <strong>Members:</strong> {Array.isArray(g.memberIds) ? g.memberIds.join(", ") : ""}
                    </p>

                    {/* <button className="btn outline" onClick={() => alert("Use backend: GET /groups/" + g.id)}>
                        View Balances
                    </button> */}
                </div>
            ))}

        </div>
    );
}
