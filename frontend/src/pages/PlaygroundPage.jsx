import { useParams } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";

function PlaygroundPage() {
  const { assistantId } = useParams();

  return (
    <div className="workspace-page">
      <PageHeader
        eyebrow={`Assistant ${assistantId}`}
        title="Playground"
        description="Test conversations and validate assistant responses."
      />

      <section className="workspace-placeholder">
        <p className="workspace-placeholder__eyebrow">AI Playground</p>

        <h2 className="workspace-placeholder__title">
          Start a test conversation
        </h2>

        <p className="workspace-placeholder__description">
          Conversation creation, message history, and AI chat will be connected
          in Phase 10.8.
        </p>
      </section>
    </div>
  );
}

export default PlaygroundPage;
