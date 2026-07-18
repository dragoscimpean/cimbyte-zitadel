import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";

export const ExternalLink = ({ children, href }: { children: ReactNode; href: string }) => {
  return (
    <a href={href} className="cb-btn cb-btn-sm">
      <div>{children}</div>

      <ArrowRightIcon className="block w-4" />
    </a>
  );
};
