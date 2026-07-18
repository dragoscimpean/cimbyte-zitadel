import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type?: AlertType;
};

export enum AlertType {
  ALERT,
  INFO,
}

export function Alert({ children, type = AlertType.ALERT }: Props) {
  return (
    <div
      className={clsx("cb-alert", {
        "cb-alert-error": type === AlertType.ALERT,
        "cb-alert-info": type === AlertType.INFO,
      })}
    >
      {type === AlertType.ALERT && <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />}
      {type === AlertType.INFO && <InformationCircleIcon className="h-5 w-5 flex-shrink-0" />}
      <span className="w-full">{children}</span>
    </div>
  );
}
