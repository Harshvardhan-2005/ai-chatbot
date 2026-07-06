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
            <p className="sidebar__brand-name">Deneb</p>

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

        <div className="sidebar__coming-soon">
          <MessageSquareText size={18} strokeWidth={1.8} />

          <span>Conversations</span>

          <span className="sidebar__badge">Soon</span>
        </div>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__platform">
          <Sparkles size={16} strokeWidth={1.8} />

          <span>Deneb Platform</span>
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
