import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";

function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.isAuthenticated) {
      props.history.push("/admin");
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      userName: userName,
      password: password,
    };

    dispatch(loginUser(userData));
  };

  let loginErrors = "";
  if (auth.error.userName || auth.error.password) {
    loginErrors =
      (auth.error.userName || "") +
      (auth.error.userName && auth.error.password ? " " : "") +
      (auth.error.password || "");
  } else loginErrors = auth.error;
  return (
    <div>
      <div id="LoginBox">
        <form noValidate onSubmit={onSubmit}>
          <div>{loginErrors || "Please sign in"}</div>
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            id="username"
            type="text"
            placeholder="Username"
            className={auth.error ? "invalid" : ""}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="txtPassword"
            type="password"
            id="txtPassword"
            placeholder="Password"
            className={auth.error ? "invalid" : ""}
          />
          <input
            type="submit"
            name="btnLogin"
            value="Login"
            id="btnLogin"
            className="LoginButton"
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
