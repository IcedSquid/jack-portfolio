import React from "react";
import "./Header.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar">
      <h1 className="logo">Jack Catchings</h1>

      <nav className="nav-center">
        <Link href="/works" className="nav-item">WORKS</Link>
        <span className="divider">|</span>
        <Link href="/playground" className="nav-item">PLAYGROUND</Link>
      </nav>

      <nav className="nav-right">
        <a href="#about" className="nav-item">ABOUT</a>
      </nav>
    </header>
  );
}
