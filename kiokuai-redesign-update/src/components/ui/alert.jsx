import { AlertTriangle } from "lucide-react";

import { cn } from "../../lib/utils";

function Alert({ className, title, children, icon: Icon = AlertTriangle, variant = "destructive", ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        variant === "destructive" &&
          "border-destructive/20 bg-destructive/5 text-destructive",
        variant === "default" && "border-border bg-muted/50 text-foreground",
        className,
      )}
      {...props}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />

      <div className="space-y-0.5">
        {title ? <p className="font-medium leading-none">{title}</p> : null}
        {children ? <div className="text-sm opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}

export default Alert;
