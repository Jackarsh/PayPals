import React, { useEffect, useState } from "react";
import API from "../api";
import { getUserName } from "../utils/userUtils";

export default function Expenses() {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupId, setGroupId] = useState("");
    const [payerId, setPayerId] = useState("");
    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");
    const [members, setMembers] = useState([]); // ids
    const [shares, setShares] = useState({});   // { userId: amount }
    const [autoSplit, setAutoSplit] = useState(true);

    useEffect(() => {
        API.get("/groups").then(r => setGroups(r.data)).catch(console.error);
        API.get("/users").then(r => setUsers(r.data)).catch(console.error);
    }, []);

    // when group changes, set members and reset shares
    useEffect(() => {
        if (!groupId) {
            setMembers([]);
            setShares({});
            return;
        }

        (async () => {
            try {
                const res = await API.get(`/groups/${groupId}`);
                // /api/groups/{id} returns group + balances in backend; our controller returns object { group, balances }
                // The previous GET /api/groups/{id} in GroupController returns group and balances map — but our controller may differ.
                // We'll safely extract group:
                const payload = res.data;
                let grp = null;
                if (payload.group) grp = payload.group;
                else if (payload.id) grp = payload; // in case backend returned group object directly
                else grp = payload.group || payload; // fallback
                const memberIds = grp.memberIds && Array.isArray(grp.memberIds) ? grp.memberIds : [];
                setMembers(memberIds);

                // auto-populate equal shares (excluding payer if desired)
                if (autoSplit && memberIds.length > 0 && amount && !isNaN(parseFloat(amount))) {
                    const amt = parseFloat(amount);
                    const equal = +(amt / memberIds.length).toFixed(2);
                    const s = {};
                    memberIds.forEach(id => s[id] = equal);
                    setShares(s);
                } else {
                    // reset shares for new group
                    const s = {};
                    memberIds.forEach(id => s[id] = 0);
                    setShares(s);
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [groupId]);

    // when amount or autoSplit toggles & members exist, recompute shares
    useEffect(() => {
        if (!autoSplit || !members || members.length === 0) return;
        if (!amount || isNaN(parseFloat(amount))) return;
        const amt = parseFloat(amount);
        const equal = +(amt / members.length).toFixed(2);
        const s = {};
        members.forEach(id => s[id] = equal);
        setShares(s);
    }, [amount, autoSplit, members]);

    const handleShareChange = (userId, val) => {
        const s = { ...shares };
        s[userId] = val === "" ? "" : parseFloat(val);
        setShares(s);
    };

    const submitExpense = async () => {
        if (!groupId || !payerId || !amount) {
            return alert("Please select group, payer and enter amount");
        }

        // prepare shares array; only include entries with numeric > 0
        const sharesArray = Object.entries(shares)
            .map(([uid, v]) => ({ userId: parseInt(uid), amount: Number(v || 0) }))
            .filter(x => !isNaN(x.amount) && x.amount > 0);

        // Basic validation: sum of shares should equal amount (or allow mismatch?)
        const sumShares = sharesArray.reduce((a, b) => a + b.amount, 0);
        if (Math.abs(sumShares - parseFloat(amount)) > 0.01) {
            // warn user but allow: prompt to proceed or cancel
            const ok = window.confirm(`Sum of shares (${sumShares.toFixed(2)}) does not equal total amount (${parseFloat(amount).toFixed(2)}). Proceed?`);
            if (!ok) return;
        }

        const payload = {
            groupId: parseInt(groupId),
            paidByUserId: parseInt(payerId),
            amount: parseFloat(amount),
            description: desc || "",
            shares: sharesArray
        };

        try {
            const res = await API.post("/expenses", payload);
            // optional: show created shares returned by backend
            alert("Expense added successfully");
            // reset form
            setAmount("");
            setDesc("");
            setPayerId("");
            // preserve group selection but reset shares
            const empty = {};
            members.forEach(m => empty[m] = 0);
            setShares(empty);
        } catch (e) {
            console.error(e);
            alert("Failed to add expense. See console.");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Add Expense — Split Among Members</h2>

                <div style={{ display: "grid", gap: 10 }}>
                    <select value={groupId} onChange={e => setGroupId(e.target.value)}>
                        <option value="">Select group</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name} (ID: {g.id})</option>)}
                    </select>

                    <select value={payerId} onChange={e => setPayerId(e.target.value)}>
                        <option value="">Paid by (select user)</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name} (ID: {u.id})</option>)}
                    </select>

                    <input placeholder="Total amount" value={amount} onChange={e => setAmount(e.target.value)} />

                    <input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />

                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <label style={{ color: "var(--muted)" }}>
                            <input type="checkbox" checked={autoSplit} onChange={e => setAutoSplit(e.target.checked)} />
                            {" "} Auto-split equally among group members
                        </label>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <h4 style={{ marginBottom: 8 }}>Split amounts (per member)</h4>

                        {members.length === 0 && <div className="small">Select a group to edit member shares.</div>}

                        {members.map(uid => (
                            <div key={uid} className="flex" style={{ marginTop: 8, alignItems: "center" }}>
                                <div style={{ minWidth: 220 }}>{getUserName(users, uid)}</div>
                                <input
                                    style={{ width: 160 }}
                                    type="number"
                                    placeholder="Amount"
                                    value={shares[uid] === undefined ? "" : shares[uid]}
                                    onChange={e => handleShareChange(uid, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <button className="btn" onClick={submitExpense}>Submit Expense</button>
                    </div>
                </div>
            </div>

            <div className="card small">
                <strong>Note:</strong> Make sure users exist (POST /api/users) and group members are valid user IDs.
            </div>
        </div>
    );
}
