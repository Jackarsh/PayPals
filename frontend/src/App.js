import React, { useState, useEffect } from "react";
import API from "./api";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Groups from "./components/Groups";
import Expenses from "./components/Expenses";
import Balances from "./components/Balances";
import Optimized from "./components/Optimized";
import Activity from "./components/Activity";

export default function App() {
    const [page, setPage] = useState("home");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get("/users")
            .then(res => setUsers(res.data))
            .catch(console.error);
    }, []);

    return (
        <>
            <Navbar onNav={setPage} />

            {page === "home" && <Home onNavigate={setPage} />}
            {page === "groups" && <Groups users={users} />}
            {page === "expenses" && <Expenses users={users} />}
            {page === "balances" && <Balances users={users} />}
            {page === "optimized" && <Optimized users={users} />}
            {page === "activity" && <Activity />}
        </>
    );
}
