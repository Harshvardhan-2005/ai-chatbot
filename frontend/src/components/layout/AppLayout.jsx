import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
