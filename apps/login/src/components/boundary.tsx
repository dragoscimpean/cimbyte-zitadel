import { ReactNode } from "react";

const Label = ({
  children,
  color,
}: {
  children: ReactNode;
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange" | "red";
}) => {
  return <div className={color === "red" ? "cb-badge cb-badge-error" : "cb-badge"}>{children}</div>;
};
export const Boundary = ({
  children,
  labels = ["children"],
  size = "default",
  color = "default",
}: {
  children: ReactNode;
  labels?: string[];
  size?: "small" | "default";
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange" | "red";
  animateRerendering?: boolean;
}) => {
  return (
    <div className={`cb-auth-card relative ${size === "small" ? "p-4" : "p-6"}`}>
      <div className="mb-4 flex gap-1">
        {labels.map((label) => {
          return (
            <Label key={label} color={color}>
              {label}
            </Label>
          );
        })}
      </div>

      {children}
    </div>
  );
};
