"use client";
import { useState } from "react";

export function Button({ 
  children, 
  onClick, 
  className = "", 
  disabled = false, 
  type = "button",
  href,
  ...props 
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async (e) => {
    if (disabled) return;
    
    setIsClicked(true);
    
    // Reset animation after 200ms
    setTimeout(() => setIsClicked(false), 200);
    
    if (onClick) {
      await onClick(e);
    }
  };

  const baseClasses = "transition-all duration-200 cursor-pointer";
  const clickClasses = isClicked ? "scale-95 opacity-80" : "hover:scale-105 active:scale-95";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const combinedClasses = `${baseClasses} ${clickClasses} ${disabledClasses} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}




