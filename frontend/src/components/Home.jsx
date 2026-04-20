import React from "react";

export default function Home({ onNavigate }) {
    return (
        <div className="container">

            {/* HERO */}
            <div className="hero">
                <h1 className="hero-title">PayPals</h1>
                <p className="hero-sub">A modern, beautiful way to split expenses.</p>

                <div className="flex" style={{ marginTop: 25, justifyContent: "center" }}>
                    <button className="btn" onClick={() => onNavigate("groups")}>
                        Manage Groups
                    </button>
                    <button className="btn outline" onClick={() => onNavigate("expenses")}>
                        Add Expense
                    </button>
                </div>
            </div>

            {/* FEATURES */}
            <div className="features">
                <div className="feature-box">
                    <h3 className="feature-title">Instant Splits</h3>
                    <p className="small">Split costs fairly with clean balance calculations.</p>
                </div>
                <div className="feature-box">
                    <h3 className="feature-title">Glassmorphic UI</h3>
                    <p className="small">A beautiful modern design with neon glow.</p>
                </div>
                <div className="feature-box">
                    <h3 className="feature-title">Fast Backend</h3>
                    <p className="small">Powered by Spring Boot + MySQL for accuracy.</p>
                </div>
            </div>

            {/* GUIDE */}
            <div className="card" style={{ marginTop: 40 }}>
                <h2>How to Use PayPals</h2>
                <ul className="small">
                    <li>Create users via backend</li>
                    <li>Create a group and add member IDs</li>
                    <li>Add expenses and track balances</li>
                </ul>
            </div>

            {/* CTA */}
            <div className="card" style={{ textAlign: "center" }}>
                <h2>Start Now</h2>
                <p className="small">Create your first group and start adding expenses.</p>
                <button className="btn" onClick={() => onNavigate("groups")}>
                    Go to Groups →
                </button>
            </div>
        </div>
    );
}
