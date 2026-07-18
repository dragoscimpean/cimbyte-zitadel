import { ThemeableProps } from "@/lib/themeUtils";
import { clsx } from "clsx";

interface SkeletonCardProps extends ThemeableProps {
  isLoading?: boolean;
}

export const SkeletonCard = ({
  isLoading,
  roundness, // Will use theme default if not provided
  spacing, // Will use theme default if not provided
  padding, // Will use theme default if not provided
}: SkeletonCardProps) => {
  // Use theme-based values if not explicitly provided
  const actualRoundness = roundness || "rounded-[var(--cb-radius)]";
  const actualSpacing = spacing || "space-y-3";
  const actualPadding = padding || "p-4";

  return (
    <div
      className={clsx(
        "bg-[var(--cb-bg-2)]",
        actualPadding,
        {
          "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent":
            isLoading,
        },
        actualRoundness, // Apply the full roundness classes directly
      )}
    >
      <div className={actualSpacing}>
        <div className={clsx("h-14 bg-[var(--cb-bg-3)]", actualRoundness.split(" ")[0])} />
        <div className={clsx("h-3 w-11/12 bg-[var(--cb-bg-3)]", actualRoundness.split(" ")[0])} />
        <div className={clsx("h-3 w-8/12 bg-[var(--cb-bg-3)]", actualRoundness.split(" ")[0])} />
      </div>
    </div>
  );
};
