import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../actions/authActions";

function Admin(props) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      props.history.push("/login");
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
    </div>
  );
}

export default Admin;
