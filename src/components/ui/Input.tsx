import React from "react";
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`input ${className ?? ""}`} />;
}
