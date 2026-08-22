import { Bot, LogOut, MessageSquareText, Sparkles } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">D</div>

          <div>
            <p className="sidebar__brand-name">KiokuAI</p>

            <p className="sidebar__brand-label">AI Workspace</p>
          </div>
        </div>
      </div>

      <nav className="sidebar__navigation" aria-label="Primary navigation">
        <p className="sidebar__section-label">Workspace</p>

        <NavLink
          to="/assistants"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <Bot size={18} strokeWidth={1.8} />

          <span>Assistants</span>
        </NavLink>

        <NavLink
          to="/conversations"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <MessageSquareText size={18} strokeWidth={1.8} />

          <span>Conversations</span>
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__platform">
          <Sparkles size={16} strokeWidth={1.8} />

          <span>KiokuAI Platform</span>
        </div>

        <button
          className="sidebar__logout"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} strokeWidth={1.8} />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
