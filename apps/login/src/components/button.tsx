import { ThemeableProps } from "@/lib/themeUtils";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";

export enum ButtonSizes {
  Small = "Small",
  Large = "Large",
}

export enum ButtonVariants {
  Primary = "Primary",
  Secondary = "Secondary",
  Destructive = "Destructive",
}

export enum ButtonColors {
  Neutral = "Neutral",
  Primary = "Primary",
  Warn = "Warn",
}

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: ButtonSizes;
  variant?: ButtonVariants;
  color?: ButtonColors;
} & ThemeableProps;

export const getButtonClasses = (
  size: ButtonSizes,
  variant: ButtonVariants,
  color: ButtonColors,
  roundnessClasses: string = "rounded-md", // Default fallback
  appearance: string = "", // Theme appearance (shadows, borders, etc.)
) =>
  clsx(
    "cb-btn",
    size === ButtonSizes.Large ? "cb-btn-lg" : "cb-btn-sm",
    variant === ButtonVariants.Primary && color !== ButtonColors.Warn && "cb-btn-primary",
    (variant === ButtonVariants.Destructive || (variant === ButtonVariants.Primary && color === ButtonColors.Warn)) &&
      "cb-btn-danger",
    variant !== ButtonVariants.Primary &&
      variant !== ButtonVariants.Destructive &&
      color === ButtonColors.Warn &&
      "cb-btn-danger-outline",
    roundnessClasses,
    appearance,
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = ButtonVariants.Primary,
      size = ButtonSizes.Small,
      color = ButtonColors.Primary,
      roundness,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        type="button"
        ref={ref}
        className={clsx(getButtonClasses(size, variant, color, roundness ?? "", ""), className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
