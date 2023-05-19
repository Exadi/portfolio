import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { findOption, defaultOptions } from "../../../utils/options";
import { Link, useLocation } from "react-router-dom";

import { setSideBarOpen } from "../../../actions/adminActions";
import ThemeModeSwitcher from "./ThemeModeSwitcher";
import { logoutUser } from "../../../actions/authActions";

function AdminHeader() {
  const auth = useSelector((state) => state.auth);
  const options = useSelector((state) => state.content.options);
  const admin = useSelector((state) => state.admin);
  const location = useLocation();

  const dispatch = useDispatch();

  const title =
    options.length > 0 && findOption(options, defaultOptions.title.name)
      ? findOption(options, defaultOptions.title.name).value
      : "";
  return (
    <div className="admin-header">
      <div className="wrapper">
        {location.pathname.includes("/admin") ? (
          <i
            className="menu-toggle fa fa-bars"
            onClick={() => dispatch(setSideBarOpen(!admin.sidebarOpen))}
          />
        ) : (
          <></>
        )}
        {auth.isAuthenticated ? (
          <span className="home-link">
            {location.pathname.includes("/admin") ? (
              <Link to="/">
                <i className="fa fa-house" />
                <span className="header-text">{title}</span>
              </Link>
            ) : (
              <Link to="/admin">
                <i className="fa fa-screwdriver" />
                <span className="header-text">{title}</span>
              </Link>
            )}
          </span>
        ) : (
          <span className="header-text">{title}</span>
        )}
        <div>
          <ThemeModeSwitcher />
          <span className="user-name">
            <i className="fa-solid fa-user"></i>
            {auth.isAuthenticated ? (
              <>
                <span className="header-text">Hello {auth.user.name}</span>
                <button
                  className="linkButton"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(logoutUser());
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link className="linkButton" to="/login">
                Log In
              </Link>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
