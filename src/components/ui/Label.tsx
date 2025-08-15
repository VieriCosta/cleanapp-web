import React from "react";
export default function Label({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <label className={`label ${className}`}>{children}</label>;
}
