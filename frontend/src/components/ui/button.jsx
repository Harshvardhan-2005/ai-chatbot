import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "../../lib/utils";
import Spinner from "./spinner";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-accent",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-9 w-9 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

const Button = forwardRef(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    disabled = false,
    children,
    ...props
  },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner className="text-current" /> : null}
      {children}
    </Comp>
  );
});

export default Button;
