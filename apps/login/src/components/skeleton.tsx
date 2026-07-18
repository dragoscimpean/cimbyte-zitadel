import { ReactNode } from "react";

export function Skeleton({ children }: { children?: ReactNode }) {
  return <div className="skeleton cb-auth-card flex flex-row items-center justify-center px-8 py-12">{children}</div>;
}
