import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import AssistantDetailPage from "../pages/AssistantDetailPage";
import AssistantsPage from "../pages/AssistantsPage";
import ConversationDetailPage from "../pages/ConversationDetailPage";
import ConversationsPage from "../pages/ConversationsPage";
import KnowledgePage from "../pages/KnowledgePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import OverviewPage from "../pages/OverviewPage";
import PlaygroundPage from "../pages/PlaygroundPage";
import RegisterPage from "../pages/RegisterPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/overview" element={<OverviewPage />} />

          <Route path="/assistants" element={<AssistantsPage />} />

          <Route
            path="/assistants/:assistantId"
            element={<AssistantDetailPage />}
          />

          <Route
            path="/assistants/:assistantId/knowledge"
            element={<KnowledgePage />}
          />

          <Route
            path="/assistants/:assistantId/playground"
            element={<PlaygroundPage />}
          />

          <Route path="/conversations" element={<ConversationsPage />} />

          <Route
            path="/conversations/:conversationId"
            element={<ConversationDetailPage />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
