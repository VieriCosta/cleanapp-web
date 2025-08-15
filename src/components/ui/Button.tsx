import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export default function Button({ className, variant = "solid", ...props }: Props) {
  const v =
    variant === "outline" ? "btn-outline" :
    variant === "ghost"   ? "btn-ghost"   :
    "btn-solid";
  return <button className={clsx("btn", v, className)} {...props} />;
}
