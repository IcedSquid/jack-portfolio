import React from "react";
import "./Header.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className="navbar">
      <Link href="/" className="logo">Jack Catchings</Link>

      <nav className="nav-center">
        <Link href="/works" className="nav-item">WORKS</Link>
        <Link href="/playground" className="nav-item">PLAYGROUND</Link>
      </nav>

      <nav className="nav-right">
        <Link href="/about" className="nav-item">ABOUT</Link>
      </nav>
    </header>
  );
}
