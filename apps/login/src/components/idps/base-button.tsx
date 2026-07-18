"use client";

import { clsx } from "clsx";
import { Loader2Icon } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import { useFormStatus } from "react-dom";

export type SignInWithIdentityProviderProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  name?: string;
  e2e?: string;
};

export const BaseButton = forwardRef<HTMLButtonElement, SignInWithIdentityProviderProps>(function BaseButton(props, ref) {
  const formStatus = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      ref={ref}
      disabled={formStatus.pending}
      className={clsx("cb-btn cb-btn-lg cb-btn-block cb-btn-left flex-1", props.className)}
    >
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-1 flex-row items-center">{props.children}</div>
        {formStatus.pending && <Loader2Icon className="h-4 w-4 animate-spin" />}
      </div>
    </button>
  );
});
