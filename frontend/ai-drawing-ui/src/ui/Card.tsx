import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  rightSlot?: React.ReactNode;
};

export function Card({ title, rightSlot, className = "", children, ...props }: Props) {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || rightSlot) && (
        <div className="cardHeader">
          <div className="cardTitle">{title}</div>
          <div className="cardRight">{rightSlot}</div>
        </div>
      )}
      <div className="cardBody">{children}</div>
    </div>
  );
}
