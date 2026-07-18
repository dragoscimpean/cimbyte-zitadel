"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";
import { ChangeEvent, DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode } from "react";

export type TextInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label: string;
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string | ReactNode;
  success?: string | ReactNode;
  disabled?: boolean;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (value: ChangeEvent<HTMLInputElement>) => void;
  roundness?: string; // Allow override via props
};

const styles = (roundness?: string) => clsx("cb-input", roundness);

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      placeholder,
      defaultValue,
      suffix,
      required = false,
      error,
      disabled,
      success,
      onChange,
      onBlur,
      roundness,
      ...props
    },
    ref,
  ) => {
    return (
      <label className="cb-field relative flex flex-col">
        <span className={clsx("cb-label", error && "[color:var(--cb-error)]")}>
          {label} {required && "*"}
        </span>
        <div className="relative">
          <input
            suppressHydrationWarning
            ref={ref}
            className={styles(roundness)}
            defaultValue={defaultValue}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={props.autoComplete ?? "off"}
            {...props}
            onChange={(e) => onChange && onChange(e)}
            onBlur={(e) => onBlur && onBlur(e)}
            aria-invalid={error ? true : props["aria-invalid"]}
          />

          {suffix && (
            <span className="absolute inset-y-px right-px flex items-center rounded-r-[var(--cb-radius)] bg-[var(--cb-bg-2)] px-3 text-sm text-[var(--cb-ink-50)]">
              @{suffix}
            </span>
          )}
        </div>

        <div className="cb-field-error min-h-[14.5px]">
          <span>{error ? error : " "}</span>
        </div>

        {success && (
          <div className="mt-1 flex flex-row items-center text-sm text-[var(--cb-success)]">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="ml-1">{success}</span>
          </div>
        )}
      </label>
    );
  },
);
