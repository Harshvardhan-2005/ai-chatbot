import { ArrowLeft, Database, MessageSquareText, Settings2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

function AssistantDetailPage() {
  const { assistantId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => navigate("/assistants")}
      >
        <ArrowLeft size={16} />
        Back to assistants
      </button>

      <PageHeader
        eyebrow={`Assistant ${assistantId}`}
        title="Assistant overview"
        description="Configure your assistant and manage its connected resources."
      />

      <Card>
        <CardContent className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Settings2 size={20} strokeWidth={1.8} />
          </div>

          <div className="max-w-sm space-y-1">
            <h2 className="text-sm font-semibold text-foreground">
              Assistant configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage this assistant's name, description, and model from the
              Assistants workspace, or jump straight into its knowledge and
              playground.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Button onClick={() => navigate(`/assistants/${assistantId}/knowledge`)}>
              <Database size={16} />
              Manage knowledge
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(`/assistants/${assistantId}/playground`)}
            >
              <MessageSquareText size={16} />
              Open playground
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssistantDetailPage;
