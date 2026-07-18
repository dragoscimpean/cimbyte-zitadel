import { clsx } from "clsx";
import { HTMLAttributes, ReactNode, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  roundness?: string; // Allow override via props
  padding?: string; // Allow override via props
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", roundness, padding, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("cb-auth-card", padding, roundness, className)} {...props}>
        {children}
      </div>
    );
  },
);
