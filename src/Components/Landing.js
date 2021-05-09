import React, { useState, useEffect } from "react";
import axios from "axios";

function Landing() {
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

export default Landing;
