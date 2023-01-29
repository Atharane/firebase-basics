import { useState } from "react";

import LoginPage from "./pages/login/index";
import DashboardPage from "./pages/dashboard/index";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div className="App">
      {isLogged ? (
        <DashboardPage />
      ) : (
        <LoginPage onClickHandler={() => setIsLogged(true)} />
      )}
    </div>
  );
}
