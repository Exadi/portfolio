import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  var getUrl = window.location;
  var baseUrl = (getUrl.protocol + "//" + getUrl.host).replace(
    "3001",
    process.env.PORT || "5001"
  );
  axios.defaults.baseURL = baseUrl;

  const [options, setOptions] = useState({});
  useEffect(() => {
    axios.get("/").then((res) => setOptions(res.data));
  }, []);

  return (
    <div className="App">
      <div
        id="header"
        style={{
          height: "100vh",
          backgroundColor: "#202020",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "max(3vw, 36px)",
        }}
      >
        {options.headerText}
      </div>
    </div>
  );
}

export default App;
