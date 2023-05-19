import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaMapSigns, FaBox, FaCog } from "react-icons/fa";

const navItems = [
  { icon: <FaMapSigns />, text: "Posts", link: "posts" },
  { icon: <FaBox />, text: "Categories", link: "categories" },
  { icon: <FaCog />, text: "Settings", link: "settings" },
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
                {item.icon}
                <span className="sidebar-text">{item.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
