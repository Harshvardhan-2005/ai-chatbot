import { useParams } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";

function AssistantDetailPage() {
  const { assistantId } = useParams();

  return (
    <div className="workspace-page">
      <PageHeader
        eyebrow={`Assistant ${assistantId}`}
        title="Assistant Overview"
        description="Configure your assistant and manage its connected resources."
      />

      <section className="workspace-placeholder">
        <p className="workspace-placeholder__eyebrow">
          Assistant Configuration
        </p>

        <h2 className="workspace-placeholder__title">
          Assistant configuration
        </h2>

        <p className="workspace-placeholder__description">
          Assistant details and configuration controls will be connected in
          Phase 10.6.
        </p>
      </section>
    </div>
  );
}

export default AssistantDetailPage;
