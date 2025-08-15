import React from "react";
export default function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return <select {...rest} className={`select ${className ?? ""}`} />;
}
