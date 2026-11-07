import React from "react";


export default function TooltipButton({
  icon,
  text,
  onClick
}) {
  return (
    <button className="tooltip-btn" onClick={onClick}>
      <i className={icon}></i>
      <span className="tooltip">{text}</span>
    </button>
  );
}