export default function OffsetButton({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`relative group h-12 font-medium ${className}`}
      >
        {/* BACK LAYER */}
        <div className="absolute inset-0 translate-x-1 translate-y-1 bg-[#00CCFF]"></div>
  
        {/* FRONT BUTTON */}
        <div className="relative z-10 w-full h-full bg-[#1D1D1D] border-2 border-[#00CCFF] flex items-center justify-center">
          <span className="text-[#00CCFF] text-base">{children}</span>
        </div>
      </button>
    );
  }
  