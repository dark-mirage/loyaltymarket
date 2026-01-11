import { ReactNode } from "react";
import { cn } from "@/app/shared";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition select-none";

  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:bg-neutral-900",
    outline: "border border-black text-black hover:bg-black hover:text-white",
    ghost: "text-black hover:bg-neutral-200",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        (disabled || loading) && disabledStyles,
        className
      )}
    >
      {loading && <span className="mr-2 inline-block animate-pulse">…</span>}

      {iconLeft && <span className="mr-2">{iconLeft}</span>}

      {children}

      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
}
