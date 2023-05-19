import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories/orderedCategories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const deleteCategory = (category) => {
    if (window.confirm(`Really delete ${category.name}?`)) {
      axios
        .delete("/api/categories/deleteCategory", { data: category })
        .then((res) => {
          setCategories(
            categories.filter((cat) => {
              return cat._id !== category._id;
            })
          );
        });
    }
  };

  return (
    <div className="admin-categories">
      <h1>Categories</h1>
      <Link className="linkButton" to="/admin/categories/edit">
        Create New
      </Link>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>Description</th>
            <th>Slug</th>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>
                <div className="actionButtons">
                  <Link
                    title={`View posts in '${category.name}' category.`}
                    className="linkButton"
                    to={`/categories/${category.slug}`}
                  >
                    View
                  </Link>
                  <button
                    title={`Delete '${category.name}' category.`}
                    className="linkButton caution"
                    onClick={() => deleteCategory(category)}
                    value={"Delete"}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td>
                <Link
                  to={{
                    pathname: "/admin/categories/edit",
                    state: { categoryName: category.name },
                  }}
                >
                  {category.name}
                </Link>
              </td>
              <td>{category.description}</td>
              <td>{category.slug}</td>
              <td>{category.postCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
