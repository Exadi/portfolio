import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MyTextEditor from "./MyTextEditor";

function EditCategory() {
  const location = useLocation();
  const categoryName = location.state ? location.state.categoryName : null;

  const [category, setCategory] = useState(null); //the single category being edited if we're not creating a new one
  const [categories, setCategories] = useState([]); //all categories, to populate the parent category dropdown

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false); //used to automatically create the slug if the field hasn't been edited manually.
  const [parentCategory, setParentCategory] = useState(null);
  const [description, setDescription] = useState("");

  //get all categories
  useEffect(() => {
    axios
      .get("/api/categories/orderedCategories")
      .then((res) => {
        if (category != null) {
          //if we're editing a category, set up the state accordingly
          setName(category.name);
          setSlug(category.slug);
          setSlugTouched(true);
          setParentCategory(category.parentCategory);
          setDescription(category.description);
          //filter the category we're editing out of the categories
          //so it can't be chosen as its own parent
          res.data = res.data.filter((cat) => {
            const isSame = cat._id === category._id;
            const isChild = cat.parentCategory === category._id;
            return !isSame && !isChild;
          });
        }
        setCategories(res.data);
      })
      .catch((err) => {
        const { message } = err.response.data;
        alert(message);
      });
  }, [category]);

  //if a categoryName was passed to the route, get the category to edit it
  useEffect(() => {
    if (categoryName != null)
      axios
        .post("/api/categories/getCategoryByName", { name: categoryName })
        .then((res) => {
          setCategory(res.data);
        })
        .catch((err) => {
          const { message } = err.response.data;
          alert(message);
        });
  }, [categoryName]);

  const processSlug = (name) => {
    return name
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(/[~!@#$&*()=:/,;?+']+/g, ""); //just get rid of characters that aren't allowed or don't look nice in a URL.
  };

  const saveCategory = () => {
    const newCategory = {
      _id: category ? category._id : null,
      name: name,
      slug: slug,
      parentCategory: parentCategory,
      description: description,
    };
    if (category != null) {
      axios
        .post("/api/categories/updateCategory", newCategory)
        .then(() => {
          alert("Saved successfully.");
        })
        .catch((err) => {
          const { message } = err.response.data;
          alert(message);
        });
    } else {
      axios
        .post("/api/categories/addCategory", newCategory)
        .then(() => {
          alert("Saved successfully.");
        })
        .catch((err) => {
          const { message } = err.response.data;
          alert(message);
        });
    }
  };

  return (
    <div>
      <h1>{categoryName ? "Edit Category" : "Create Category"}</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (!slugTouched) {
            setSlug(processSlug(e.target.value));
          }
        }}
      ></input>

      <input
        type="text"
        placeholder="slug"
        value={slug}
        onChange={(e) => {
          setSlug(processSlug(e.target.value));
          setSlugTouched(true);
        }}
      />

      <span>Parent Category:</span>
      <select
        onChange={(e) =>
          setParentCategory(e.target.value === "None" ? null : e.target.value)
        }
        value={parentCategory ? parentCategory : ""}
      >
        <option key={"none"} value={null}>
          None
        </option>
        {categories.map((category) => {
          return (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          );
        })}
      </select>
      <h2>Description</h2>
      <MyTextEditor value={description} onChange={setDescription} />
      <input type="button" value="Save" onClick={() => saveCategory()} />
    </div>
  );
}

export default EditCategory;
