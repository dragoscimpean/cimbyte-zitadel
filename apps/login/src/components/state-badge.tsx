import { clsx } from "clsx";
import { ReactNode } from "react";

export enum BadgeState {
  Info = "info",
  Error = "error",
  Success = "success",
  Alert = "alert",
}

export type StateBadgeProps = {
  state: BadgeState;
  children: ReactNode;
  evenPadding?: boolean;
};

const getBadgeClasses = (state: BadgeState, evenPadding: boolean) =>
  clsx("cb-badge", {
    "cb-badge-success": state === BadgeState.Success,
    "cb-badge-info": state === BadgeState.Info,
    "cb-badge-error": state === BadgeState.Error,
    "cb-badge-warning": state === BadgeState.Alert,
    "p-[2px]": evenPadding,
  });

export function StateBadge({ state = BadgeState.Success, evenPadding = false, children }: StateBadgeProps) {
  return <span className={`${getBadgeClasses(state, evenPadding)}`}>{children}</span>;
}
