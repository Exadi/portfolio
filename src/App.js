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

  return <div className="App">{options.headerText}</div>;
}

export default App;
