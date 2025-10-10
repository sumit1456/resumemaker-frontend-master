import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import "./App.css";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [userId, setUserId] = useState(null);

  return (
    <div className="app-container">
      {/* Pass login status and user ID to the NavBar */}
      <NavBar isLogged={isLogged} userId={userId} setIsLogged={setIsLogged} />

      <Routes>
        <Route
          path="/*"
          element={
            <HomePage
              isLogged={isLogged}
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

        
      </Routes>
    </div>
  );
}
