"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-medium tracking-tightx",
    "ring-offset-background transition-all duration-200",
    "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    "press",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary: solid periwinkle
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.55)] hover:bg-iris-600 hover:shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.65)]",
        // Secondary: soft mist with ink text
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-mist-300/70",
        // Outline: white with iris border
        outline:
          "border border-primary/25 bg-background text-foreground hover:border-primary/60 hover:bg-secondary",
        // Ghost
        ghost: "text-foreground hover:bg-secondary",
        // Solid ink (used on light gradient strips)
        ink: "bg-foreground text-background hover:bg-ink-800",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "h-auto p-0 text-primary underline-offset-4 hover:underline",
        // Kept name for compatibility — same as default
        gradient:
          "bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.55)] hover:bg-iris-600 hover:shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.65)]",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
