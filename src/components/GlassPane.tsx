import React from "react";
import clsx from "clsx";

interface GlassPaneProps {
  children: React.ReactNode;
  className?: string;
}
const GlassPane = ({ children, className = "" }: GlassPaneProps) => {
  return (
    <div
      className={clsx("rounded-2xl border-gray-200 border-2 glass", className)}
    >
      {children}
    </div>
  );
};

export default GlassPane;
