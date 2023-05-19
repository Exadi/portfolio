import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const navItems = [
  { icon: "fa-signs-post", text: "Posts", link: "posts" },
  { icon: "fa-box", text: "Categories", link: "categories" },
  { icon: "fa-gear", text: "Settings", link: "settings" },
];
function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.admin);
  return (
    <div className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <ul>
        {navItems.map((item) => {
          return (
            <li key={item.link}>
              <Link to={`/admin/${item.link}`}>
                <i className={`fa ${item.icon}`} />
                <span className="">{item.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
