import React from "react";


export default function Footer() {

  const version = "1.0.0"; // later you can import this from package.json
  return (
    <footer className="footer">
      <p>Strategy planner v{version}</p>
      <div className="icons">
        <a
          href="https://github.com/LucR31/strategy_tree_planner"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-github"></i>
        </a>
        <a
          href="https://discord.gg/aZRSXdEb"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-discord"></i>
        </a>
      </div>
    </footer>
  );
}