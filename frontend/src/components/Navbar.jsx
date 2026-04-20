import React from "react";

export default function Navbar({ onNav }) {
    return (
        <header className="header">
            <div className="nav">
                <div className="logo" onClick={() => onNav("home")}>PayPals</div>

                <div className="navlinks">
                    <button onClick={() => onNav("home")}>Home</button>
                    <button onClick={() => onNav("groups")}>Groups</button>
                    <button onClick={() => onNav("expenses")}>Expenses</button>
                    <button onClick={() => onNav("balances")}>Balances</button>
                    <button onClick={() => onNav("optimized")}>Optimized</button>
                    <button onClick={() => onNav("activity")}>Activity</button>
                </div>
            </div>
        </header>
    );
}
