import React, { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <ul>
          <li>Personal Info</li>
          <li>Bio</li>
          <li>Education</li>
          <li>Experience</li>
          <li>Projects</li>
        </ul>
      </div>
    </>
  );
}