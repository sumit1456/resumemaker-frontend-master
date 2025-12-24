import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from './redux/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MessageContainer from "./components/PopUp/ToastMessages.jsx";
import ErrorBoundary from "./ErrorBoundry.jsx";
import reportWebVitals from "./reportWebVitals";

// Performance monitoring
reportWebVitals(console.log);



ReactDOM.createRoot(document.getElementById("root")).render(

  <BrowserRouter>

    <ErrorBoundary >
      <Provider store={store} >
        <GoogleOAuthProvider clientId="702821068415-um4cbj2o2m9rog3t1gdlqhcbudhph6p9.apps.googleusercontent.com">
          <MessageContainer />
          <App />
        </GoogleOAuthProvider>
      </Provider>
    </ErrorBoundary>

  </BrowserRouter>

);


