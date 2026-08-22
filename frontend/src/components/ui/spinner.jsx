import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils";

function Spinner({ size = 16, className = "" }) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin", className)}
      aria-hidden="true"
    />
  );
}

export default Spinner;
