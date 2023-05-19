import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MyTextEditor from "./MyTextEditor";
import { useLocation } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const [post, setPost] = useState(location.state ? location.state.post : null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [URL, setURL] = useState("");
  const [URLTouched, setURLTouched] = useState(false); //URL will be auto-generated until edited manually

  //all categories this post belongs to - will not be saved/loaded - only used to generate URLs
  const [postCategories, setPostCategories] = useState([]);

  //all categories this post belongs to (ID only) - this is what will be saved to DB
  const [postCategoryIDs, setPostCategoryIDs] = useState([]);
  const [categories, setCategories] = useState([]); //all categories

  useEffect(() => {
    axios.get("/api/categories/orderedCategories").then((res) => {
      const allCategories = res.data;
      setCategories(allCategories);

      if (post) {
        //assume the user doesn't want to auto-generate a new URL when editing a post
        //needs to be set before setting the title/categories as that fires an effect that
        //sets the URL
        setURLTouched(true);
        setURL(post.url);

        setTitle(post.title);
        setText(post.text);
        //initialize an array of IDs only and one with all the category information.
        //TODO it's probably best to just get rid of the ID array and just map the full category array to IDs only before saving
        setPostCategoryIDs(post.categories.map((cat) => cat._id));
        setPostCategories(
          post.categories.map((cat) =>
            allCategories.find((el) => el._id === cat._id)
          )
        );
      }
    });
  }, [post]);

  const handleCategoryCheckbox = (id, category) => {
    console.log("handleCategoryCheckbox");
    console.log(postCategoryIDs);
    if (postCategoryIDs.includes(id)) {
      setPostCategoryIDs(
        postCategoryIDs.filter((cat) => {
          return cat !== id;
        })
      );
      setPostCategories(
        postCategories.filter((cat) => {
          return cat._id !== id;
        })
      );
    } else {
      setPostCategoryIDs([...postCategoryIDs, id]);
      setPostCategories([...postCategories, category]);
    }
  };

  useEffect(() => {
    if (!URLTouched) {
      //we only need to change the URL if this is the first category being selected
      //or if all categories are now deselected
      if (postCategories.length === 0) setURL(processURL(title, ""));
      else if (postCategories.length === 1)
        setURL(processURL(title, postCategories[0].slug));
    }
  }, [title, postCategories]);

  useEffect(() => {
    //ensure URL starts with /
    if (URL && URL[0] !== "/") setURL(`/${URL}`);
  }, [URL]);

  const savePost = () => {
    const newPost = {
      _id: post ? post._id : null,
      title: title,
      author: post ? post.author : auth.user.id,
      text: text,
      excerpt: null,
      categories: postCategoryIDs,
      datePublished: post ? post.datePublished : Date.now(),
      url: URL,
    };
    console.log(newPost);
    if (post != null) {
      axios
        .post("/api/posts/updatePost", newPost)
        .then(() => {
          alert("Saved successfully.");
        })
        .catch((err) => {
          const { message } = err.response.data;
          alert(message);
        });
    } else {
      axios
        .post("/api/posts/addPost", newPost)
        .then(() => {
          alert("Saved successfully.");
        })
        .catch((err) => {
          const { message } = err.response.data;
          alert(message);
        });
    }
  };

  const processURL = (title, firstCategorySlug) => {
    //just get rid of characters that aren't allowed or don't look nice in a URL.
    const processedTitle = title
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[~!@#$&*()=:/,;?+']+/g, "");
    if (firstCategorySlug !== "") {
      return `/${firstCategorySlug}/${processedTitle}`;
    }
    return `/${processedTitle}`;
  };

  return (
    <div>
      <h1>{post ? "Edit Post" : "Create Post"}</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      ></input>
      <input
        type="text"
        placeholder="URL"
        value={URL}
        onChange={(e) => {
          setURL(e.target.value);
          setURLTouched(true);
        }}
      ></input>
      <h2>Content</h2>
      <MyTextEditor value={text} onChange={setText} />
      <h2>Categories:</h2>
      {categories.map((cat, idx) => {
        return (
          <React.Fragment key={idx}>
            {/*TODO calculate indent for child categories*/}
            <span
              style={{ display: "inline-block", width: `${1 * cat.depth}em` }}
            ></span>
            <input
              type="checkbox"
              id={cat._id}
              onChange={() => {
                handleCategoryCheckbox(cat._id, cat);
              }}
              checked={postCategoryIDs.find((el) => el === cat._id)}
            />
            <label htmlFor={cat._id}>{cat.name}</label>
            <br />
          </React.Fragment>
        );
      })}
      <input
        className="linkButton"
        type="button"
        value="Save"
        onClick={() => savePost()}
      />
    </div>
  );
}

export default EditPost;
