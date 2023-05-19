import React, { useEffect } from "react";
import "./App.css";
import axios from "axios";

import { Provider } from "react-redux";
import store from "./store";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { setOptions } from "./actions/contentActions";
import Root from "./Components/Root";

function App() {
  // Check for token to keep user logged in
  useEffect(() => {
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
      // Set user and isAuthenticated
      store.dispatch(setCurrentUser(decoded)); // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
      if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser()); // Redirect to login
        window.location.href = "./login";
      }
    }
    axios.get("/api/options/").then((res) => {

      store.dispatch(setOptions(res.data));
    });
  }, []);

  var getUrl = window.location;
  var baseUrl = (getUrl.protocol + "//" + getUrl.host).replace(
    /[0-9]{4}/g,
    process.env.PORT || "5001"
  );
  axios.defaults.baseURL = baseUrl;

  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}

export default App;
