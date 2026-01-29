import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar />
      <div className="main-wrapper" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <main className="main-content" style={{ padding: "24px 32px 32px 32px", flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
