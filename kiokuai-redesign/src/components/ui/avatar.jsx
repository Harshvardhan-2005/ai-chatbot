import { cn } from "../../lib/utils";
import { getInitials } from "../../lib/utils";

function Avatar({ name = "", className = "", size = 36 }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(name) || "?"}
    </div>
  );
}

export default Avatar;
