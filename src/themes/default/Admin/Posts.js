import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts/getAggregatedPosts").then((res) => {
      setPosts(res.data);
    });
  }, []);

  const deletePost = (post) => {
    if (window.confirm(`Really delete ${post.title}?`)) {
      axios.delete("/api/posts/deletePost", { data: post }).then((res) => {
        setPosts(
          posts.filter((p) => {
            return p._id !== post._id;
          })
        );
      });
    }
  };

  return (
    <div className="admin-posts">
      <h1>Posts</h1>
      <Link className="linkButton" to="/admin/posts/edit">
        Create New
      </Link>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Title</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Date Published</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>
                <div className="actionButtons">
                  <Link
                    title={`View post '${post.title}'.`}
                    className="linkButton"
                    to={post.url}
                  >
                    View
                  </Link>
                  <button
                    title={`Delete post '${post.title}'.`}
                    className="linkButton caution"
                    onClick={() => deletePost(post)}
                    value={"Delete"}
                  >
                    Delete
                  </button>
                </div>
              </td>
              <td>
                <Link
                  to={{
                    pathname: "/admin/posts/edit",
                    state: { post: post },
                  }}
                >
                  {post.title}
                </Link>
              </td>
              <td>{post.author.userName}</td>
              <td>
                {post.categories.length === 0
                  ? "Uncategorized"
                  : post.categories.map((cat) => cat.name).join(", ")}
              </td>
              <td>{new Date(post.datePublished).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Posts;
