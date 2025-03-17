import { lazy, Suspense } from "react";
import "./App.css";
import AppRouter from "./Routes/App_router";
import { AuthContextProvider } from "./Contexts/AuthContext";
import { useSelector } from "react-redux";

const SettingsPannel = lazy(() => import("./component/SettingsPannel"));
const ConfrmMessage = lazy(() => import("./component/ConfrmMessage"));

function App() {
  const { successmsg } = useSelector((state) => state.setting);
 

  return (
    <>
        <SettingsPannel /> 
      <Suspense fallback={null}>
        <AuthContextProvider>
          {successmsg?.length > 0 && <ConfrmMessage />}
          <AppRouter />
        </AuthContextProvider>
      </Suspense>
    </>
  );
}

export default App;
