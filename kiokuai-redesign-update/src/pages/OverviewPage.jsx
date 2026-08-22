import { Bot, MessageSquareText, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getChatbots } from "../api/chatbotApi";
import { getConversations } from "../api/conversationApi";
import Badge from "../components/ui/badge";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Skeleton from "../components/ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import { formatRelativeTime } from "../lib/utils";

function StatCard({ label, value, icon: Icon, isLoading }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={19} strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>

          {isLoading ? (
            <Skeleton className="mt-1 h-6 w-10" />
          ) : (
            <p className="text-xl font-semibold tabular-nums text-foreground">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assistants, setAssistants] = useState([]);
  const [conversationCount, setConversationCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        const [assistantsResponse, conversationsResponse] = await Promise.all([
          getChatbots({ page: 1, size: 6 }),
          getConversations({ page: 1, limit: 100 }).catch(() => null),
        ]);

        if (!isMounted) return;

        const assistantItems = Array.isArray(assistantsResponse)
          ? assistantsResponse
          : assistantsResponse?.items || assistantsResponse?.data || [];

        setAssistants(assistantItems);

        if (conversationsResponse) {
          const conversationItems = Array.isArray(conversationsResponse)
            ? conversationsResponse
            : conversationsResponse?.items || conversationsResponse?.data || [];

          setConversationCount(conversationItems.length);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const greetingName = user?.username || "there";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Overview
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Good to see you, {greetingName}
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground">
            Build and manage your AI assistants.
          </p>
        </div>

        <Button onClick={() => navigate("/assistants")}>
          <Plus size={17} />
          Create assistant
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Assistants"
          value={assistants.length}
          icon={Bot}
          isLoading={isLoading}
        />

        {conversationCount !== null ? (
          <StatCard
            label="Conversations"
            value={conversationCount}
            icon={MessageSquareText}
            isLoading={isLoading}
          />
        ) : null}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Recent assistants
          </h2>

          <Link
            to="/assistants"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : assistants.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles size={20} strokeWidth={1.8} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                No assistants yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first AI assistant to get started.
              </p>
            </div>

            <Button size="sm" onClick={() => navigate("/assistants")}>
              <Plus size={16} />
              Create assistant
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {assistants.slice(0, 6).map((assistant) => (
              <Card
                key={assistant.id}
                className="cursor-pointer transition-colors hover:border-primary/40"
                onClick={() => navigate(`/assistants/${assistant.id}/playground`)}
              >
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bot size={16} strokeWidth={1.8} />
                    </div>

                    <Badge variant={assistant.is_active ? "success" : "secondary"}>
                      {assistant.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <p className="truncate text-sm font-medium text-foreground">
                      {assistant.name}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {assistant.description}
                    </p>
                  </div>

                  {assistant.updated_at ? (
                    <p className="text-[11px] text-muted-foreground">
                      Updated {formatRelativeTime(assistant.updated_at)}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OverviewPage;
