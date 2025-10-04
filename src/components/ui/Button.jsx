import React from "react";

export function Button({ className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition";
  const styles =
    variant === "secondary"
      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {props.children}
    </button>
  );
}
