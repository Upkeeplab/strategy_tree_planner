import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";

export default function Header() {
  return (
    <header className="header">
      <h1 className="font-size: 30px; font-family:Arial, Helvetica, sans-serif; letter-spacing: 5px;">
        Strategy Planner
      </h1>

    <nav className="toolbar">
      <Link to="/guide">Docs </Link>
      <Link to="/guide">Settings </Link>
      <Link to="/login">Login</Link>
          
    </nav>
     <ThemeSelector />
    </header>
  );
}