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
import Demo from "./Demo.jsx";
import { logInUser } from "./redux/store.js";



export default function App() {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check for token and userId in localStorage on mount
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
      // Restore Redux state
      dispatch(logInUser(storedUserId));

      // Restore Local App state (if acceptable to continue using mixed state)
      // Note: setUserId is passed from parent usually or defined here. 
      // In this component, 'userId' state is defined on line 22.
      setUserId(storedUserId);
      setIsLogged(true);
    }
  }, [dispatch]);

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
        <Route path="ui-editor/webgl" element={<B3 />} />
        <Route path="ui-editor/webgl/:resumeId" element={<B3 />} />
        <Route path="ui-editor/webgl/:resumeId/:templateId" element={<B3 />} />
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
        <Route path="/demo" element={<Demo />} />

      </Routes>
    </div>

  );
}
