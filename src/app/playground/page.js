import React from "react";
import Header from "../components/Header";
import "./playground.css";

export default function WorksPage() {
  return (
    <div className="works-page">

      <main className="works-content">
        <h1>Playground</h1>
        <div className="works-grid">
          {/* 9 boxes */}
          {Array.from({ length: 9 }).map((_, index) => (
            <a href="#" key={index} className="work-box"></a>
          ))}
        </div>
      </main>
    </div>
  );
}
