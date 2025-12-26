"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FloatingNavControls({
  showBack = true,
  showTop = true,
  backHref = "/works",
  threshold = 250, // px scrolled before buttons appear
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold);
    }

    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <>
      {/* Bottom-left: Back to Works */}
      {showBack && (
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className={`fixed bottom-7 left-9 z-50 border border-[#898989] bg-[#1d1d1d] px-4 py-3 text-[#898989] shadow-lg hover:bg-[#11326E] hover:border-[#00CCFF] hover:text-[#00CCFF]
            transition-all duration-500 ease-in-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}
          aria-label="Back to Works"
        >
          ← Back
        </button>
      )}

      {/* Bottom-right: Back to Top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-7 right-9 z-50 border border-[#898989] bg-[#1d1d1d] px-4 py-3 text-[#898989] shadow-lg hover:bg-[#11326E] hover:border-[#00CCFF] hover:text-[#00CCFF]
            transition-all duration-500 ease-in-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
          `}          
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  );
}
