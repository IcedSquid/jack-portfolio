import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="navbar">
      <h1 className="logo">Jack Catchings</h1>

      <nav className="nav-center">
        <a href="#works" className="nav-item">WORKS</a>
        <span className="divider">|</span>
        <a href="#playground" className="nav-item">PLAYGROUND</a>
      </nav>

      <nav className="nav-right">
        <a href="#about" className="nav-item">ABOUT</a>
      </nav>
    </header>
  );
}
