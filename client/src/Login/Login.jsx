import React from "react";
import "./Login.css";

export default function Auth() {
  return (
    <div className="auth-container">

      <h2>Login / Sign Up</h2>

      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <button className="auth-btn">Login</button>
      <button className="auth-btn">Sign Up</button>

      <div className="divider">OR</div>

      <button className="google-btn">
        Continue with Google
      </button>

    </div>
  );
}