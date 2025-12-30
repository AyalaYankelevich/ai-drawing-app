import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "success" | "danger";
};

export function Button({ variant = "default", className = "", ...props }: Props) {
  return <button className={`btn ${variant} ${className}`} {...props} />;
}
