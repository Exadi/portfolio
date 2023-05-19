import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewPost() {
  const path = window.location.pathname;
  //TODO make sure this actually covers all possible URLs that could be entered...

  const word = "[\\w-]+"; //update this with any valid characters other than letters and dashes

  const regex = new RegExp(`\\/${word}(?:\\/${word})*$`);
  const url = path.match(regex);

  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.post("/api/posts/", { url: url }).then((res) => {
      setPost(res.data[0]);
    });
  }, [url]);

  if (post) {
    return (
      <div className="view-post">
        <h1>{post.title}</h1>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{
            __html: post.text,
          }}
        ></div>
      </div>
    );
  } else return <>Loading...</>;
}

export default ViewPost;
