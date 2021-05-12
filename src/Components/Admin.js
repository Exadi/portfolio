import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../actions/authActions";
import axios from "axios";

function Admin(props) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      props.history.push("/login");
    } else {
      axios.get("/api/options/").then((res) => setOptions(res.data));
    }
  });

  return (
    <div>
      Hello {auth.user.name}
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(logoutUser());
        }}
      >
        Log out
      </button>
      {options.map((option) => {
        return (
          <div>
            {option.name}: {option.value}
          </div>
        );
      })}
    </div>
  );
}

export default Admin;
