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




export default function App() {
 
  const isLoggedIn = useSelector( (state)=> state.auth.isLoggedIn);

  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(()=>{
    const wakeserver = async()=>{
      try {
        
        
       
        
      } catch (error) {
        console.log(error);
      }
    }

    wakeserver();
  
  }, [])

  return (
    <div className="app-container">
      
      {/* Pass login status and user ID to the NavBar */}
      <NavBar isLogged={isLogged} userId={userId} setIsLogged={setIsLogged} />
     

      <Routes>
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

        
      </Routes>
    </div>
  );
}
