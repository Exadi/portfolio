import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ViewCategory.css";

/* This component displays all posts in a category
If used as a standalone page, it will find the category by the URL and display all posts.
If a category is passed in, it will show only 3 posts and link to the standalone category page if there are more to show.

Post titles and content are shown with a read more link.
Images in the post content are not shown.
*/

function ViewCategory(props) {
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);

  //I might want to also use this component as part of another page
  //and pass the category instead of getting it from URL
  let slug = undefined;
  if (props.category) {
    slug = props.category;
  } else {
    const path = window.location.pathname;
    const parts = path.split("/"); // split the path into an array of parts
    slug = parts[2];
  }

  useEffect(() => {
    axios.post("/api/categories/", { slug: slug }).then((res) => {
      setCategory(res.data[0]);
    });
    axios.post("/api/posts/", { categories: slug }).then((res) => {
      setPosts(res.data);
    });
  }, [slug]);

  if (category) {
    //redefine which header levels we're using depending on
    //whether this component is being used as a standalone page or not
    const H1 = props.category ? `h2` : `h1`;
    const H2 = props.category ? `h3` : `h2`;
    const className = props.category
      ? `view-category`
      : `view-category-standalone`;

    return (
      <section className={`${props.className} ${className}`}>
        <H1 className="category-name outlined">{category.name}</H1>
        <div
          className="category-description"
          dangerouslySetInnerHTML={{
            __html: category.description,
          }}
        ></div>
        <div className="post-grid">
          {posts.map((post, idx) => {
            //limit posts to 3 if we aren't viewing the full page,
            //and provide a link to the full page if it goes over 3
            if (props.category && idx >= 3)
              return (
                <Link className="read-more" to={`/categories/${category.slug}`}>
                  {`More in ${category.name}`}
                </Link>
              );
            return (
              <div key={post._id} className="post-card">
                <H2 className="post-title">{post.title}</H2>
                <div
                  className="post-text-preview"
                  dangerouslySetInnerHTML={{
                    __html: post.text,
                  }}
                ></div>
                <Link to={post.url} className="read-more">
                  Read More
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    );
  } else return <div>Loading...</div>;
}

export default ViewCategory;
