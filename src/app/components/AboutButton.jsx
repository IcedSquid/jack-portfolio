import React from "react";
import { useReducer } from "react";

export const AboutButton = ({ property1, className }) => {
  const [state, dispatch] = useReducer(reducer, {
    property1: property1 || "default",
  });

  return (
    <div
      className={`w-20 relative ${state.property1 === "variant-2" ? "top-[68px]" : "top-5"} ${state.property1 === "variant-2" ? "h-7" : "h-6"} ${className}`}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
    >
      {state.property1 === "default" && (
        <div className="absolute w-[88.75%] h-[85.71%] top-[4.17%] left-[5.00%] [font-family:'Inter',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-[normal] whitespace-nowrap">
          ABOUT
        </div>
      )}

      {state.property1 === "variant-2" && (
        <>
          <img
            className="absolute w-full h-0 top-full left-0"
            alt="Line"
            src="https://c.animaapp.com/rL3p8MFB/img/line-2-2.svg"
          />

          <div className="absolute w-[80.00%] h-[78.57%] top-0 left-[10.00%] [font-family:'Inter',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-[normal]">
            ABOUT
          </div>
        </>
      )}
    </div>
  );
};

function reducer(state, action) {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        property1: "variant-2",
      };

    case "mouse_leave":
      return {
        ...state,
        property1: "default",
      };
  }

  return state;
}
