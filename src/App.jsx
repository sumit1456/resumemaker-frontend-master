import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import "./App.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import EmailVerification from "./features/auth/Verification.jsx";
import BackendWakePopup from "./components/PopUp/Backendpopup.jsx";
import EditorPage from "./pages/UI-Edits/EditorPage.jsx";
import B3 from "./pages/UI-Edits/b3.jsx";
import FidelityBenchmark from "./pages/UI-Edits/FidelityBenchmark.jsx";



export default function App() {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const wakeserver = async () => {
      try {




      } catch (error) {
        console.log(error);
      }
    }

    wakeserver();

  }, [])

  return (


    <div className="app-container">
      <NavBar isLogged={isLogged} userId={userId} setIsLogged={setIsLogged} />
      <Routes>

        <Route path="ui-editor" element={<EditorPage></EditorPage>}></Route>
        <Route path="ui-editor/webgl" element={<B3 initialUseWebGL={true} />} />
        <Route
          path="/*"
          element={
            <HomePage
              isLogged={isLoggedIn}
              setIsLogged={setIsLogged}
              userId={userId}
              setUserId={setUserId}
            />
          }
        />
        <Route
          path="/dashboard/*"
          element={<Dashboard userId={userId} setUserId={setUserId} />}
        />

        <Route path="/verify" element={<EmailVerification />} />
        <Route path="/benchmark" element={<FidelityBenchmark />} />
      </Routes>
    </div>

  );
}
