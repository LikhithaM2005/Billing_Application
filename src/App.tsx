import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { DashboardProvider } from "./DashboardPage/DashboardContext";

function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;


