import { forwardRef, useId } from "react";

import { cn } from "../../lib/utils";

const Textarea = forwardRef(function Textarea(
  { label, error, helperText, className = "", id, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium leading-none text-foreground"
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={Boolean(error)}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
