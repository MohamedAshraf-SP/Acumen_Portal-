import { lazy, Suspense } from "react";
import "./App.css";
import AppRouter from "./Routes/App_router";
import { useSelector } from "react-redux";

const SettingsPannel = lazy(() => import("./component/SettingsPannel"));
const ConfrmMessage = lazy(() => import("./component/ConfrmMessage"));

function App() {
  return (
    <Suspense fallback={null}>
      <SettingsPannel />
      <ConfrmMessage />
      <AppRouter />
    </Suspense>
  );
}

export default App;
