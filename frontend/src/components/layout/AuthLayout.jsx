import { Bot, Database, MessageSquareText } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <main className="auth-layout">
      <section className="auth-layout__brand">
        <div className="auth-brand">
          <div className="auth-brand__mark">D</div>

          <p className="auth-layout__footer">
            KiokuAI — AI-powered knowledge workspace
          </p>
        </div>

        <div className="auth-hero">
          <p className="auth-hero__eyebrow">AI assistant platform</p>

          <h1 className="auth-hero__title">
            Build assistants with knowledge that belongs to you.
          </h1>

          <p className="auth-hero__description">
            Create intelligent assistants, connect structured knowledge, and
            test conversations from one focused workspace.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <Bot size={20} strokeWidth={1.8} />

              <div>
                <h2>Create assistants</h2>

                <p>Configure focused AI assistants for your use cases.</p>
              </div>
            </div>

            <div className="auth-feature">
              <Database size={20} strokeWidth={1.8} />

              <div>
                <h2>Add knowledge</h2>

                <p>Ground every assistant with its own knowledge base.</p>
              </div>
            </div>

            <div className="auth-feature">
              <MessageSquareText size={20} strokeWidth={1.8} />

              <div>
                <h2>Test conversations</h2>

                <p>Use the playground to validate responses and context.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="auth-layout__footer">
          KiokuAI — AI-powered knowledge workspace
        </p>
      </section>

      <section className="auth-layout__form">
        <div className="auth-form-container">{children}</div>
      </section>
    </main>
  );
}

export default AuthLayout;
