import "./App.css";
import ConfrmMessage from "./component/ConfrmMessage";
import SettingsPannel from "./component/SettingsPannel";
import AppRouter from "./Routes/App_router";

function App() {
  return (
    <>
      
      <SettingsPannel />
       <ConfrmMessage />
      <AppRouter />
    </>
  );
}

export default App;
