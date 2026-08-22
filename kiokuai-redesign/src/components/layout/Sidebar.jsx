import {
  Bot,
  LayoutGrid,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import Avatar from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const NAV_ITEMS = [
  { to: "/overview", label: "Overview", icon: LayoutGrid },
  { to: "/assistants", label: "Assistants", icon: Bot },
  { to: "/conversations", label: "Conversations", icon: MessageSquareText },
];

function SidebarBrand({ collapsed }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-4 py-4",
        collapsed && "justify-center px-0",
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        K
      </div>

      {!collapsed ? (
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            KiokuAI
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            AI Workspace
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NavLinks({ collapsed, onNavigate }) {
  return (
    <nav className="flex flex-col gap-0.5 px-2" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const link = (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )
            }
          >
            <Icon size={17} strokeWidth={1.8} className="shrink-0" />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        );

        if (!collapsed) return link;

        return (
          <Tooltip key={to} delayDuration={200}>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

export function SidebarInner({
  collapsed = false,
  onNavigate,
  onToggleCollapse,
  showToggle = true,
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const displayName = user?.username || user?.email || "Account";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-sidebar-border">
        <SidebarBrand collapsed={collapsed} />

        {showToggle ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="mr-3 hidden shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <NavLinks collapsed={collapsed} onNavigate={onNavigate} />
      </div>

      <div className="border-t border-sidebar-border p-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-2",
            collapsed && "justify-center px-0",
          )}
        >
          <Avatar name={displayName} size={28} className="text-[11px]" />

          {!collapsed ? (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-sidebar-foreground">
                {displayName}
              </p>
              {user?.email ? (
                <p className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {collapsed ? (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full items-center justify-center rounded-md px-0 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-destructive"
              >
                <LogOut size={17} strokeWidth={1.8} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-destructive"
          >
            <LogOut size={17} strokeWidth={1.8} />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <SidebarInner collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </aside>
  );
}

export default Sidebar;
