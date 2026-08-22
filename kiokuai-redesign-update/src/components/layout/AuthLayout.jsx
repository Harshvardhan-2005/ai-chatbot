import { Bot, Database, MessageSquareText } from "lucide-react";

import ThemeToggle from "../ui/theme-toggle";

const FEATURES = [
  {
    icon: Bot,
    title: "Create assistants",
    description: "Configure focused AI assistants for your use cases.",
  },
  {
    icon: Database,
    title: "Add knowledge",
    description: "Ground every assistant with its own knowledge base.",
  },
  {
    icon: MessageSquareText,
    title: "Test conversations",
    description: "Use the playground to validate responses and context.",
  },
];

function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen w-full lg:grid-cols-2">
      <ThemeToggle className="fixed right-4 top-4 z-40" />

      <section className="relative hidden flex-col justify-between overflow-hidden bg-foreground px-10 py-10 text-background lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            K
          </div>
          <span className="text-sm font-semibold">KiokuAI</span>
        </div>

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-background/60">
              AI assistant platform
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              Build assistants with knowledge that belongs to you.
            </h1>

            <p className="text-sm text-background/70">
              Create intelligent assistants, connect structured knowledge, and
              test conversations from one focused workspace.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/10">
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                <div>
                  <h2 className="text-sm font-medium">{title}</h2>
                  <p className="text-sm text-background/60">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-background/40">
          KiokuAI — AI knowledge platform
        </p>
      </section>

      <section className="flex items-center justify-center bg-background px-6 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </main>
  );
}

export default AuthLayout;
