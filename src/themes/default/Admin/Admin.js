import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Sidebar from "./Sidebar";
import "./admin.scss";

import Settings from "./Settings";
import Posts from "./Posts";
import EditPost from "./EditPost";
import Categories from "./Categories";
import EditCategory from "./EditCategory";

function Admin(props) {
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      props.history.push("/login");
    }
  }, [auth.isAuthenticated, props.history]);

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className={`admin-main ${props.sidebarOpen ? "sidebar-open" : ""}`}>
        <Switch>
          <Route exact path="/admin/posts" component={Posts} />
          <Route exact path="/admin/posts/edit" component={EditPost} />
          <Route exact path="/admin/categories" component={Categories} />
          <Route exact path="/admin/categories/edit" component={EditCategory} />
          <Route path="/admin/settings" component={Settings} />
        </Switch>
      </div>
    </div>
  );
}

export default Admin;
