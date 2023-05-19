import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { optionTypes } from "../../../utils/options";
import { setOptions } from "../../../actions/contentActions";

import themeOptions from "../themeOptions";
import MyTextEditor from "./MyTextEditor";

function Settings() {
  const options = useSelector((state) => state.content.options);
  const themeFolders = useSelector((state) => state.content.themeFolders);

  const dispatch = useDispatch();
  //add in the themeOptions that aren't saved in the database yet.

  useEffect(() => {
    const newOptions = [...options];
    themeOptions.forEach((opt) => {
      if (
        newOptions.find((o) => {
          return o.name === opt.name;
        })
      ) {
        console.log(`${opt.name} already in DB...`);
      } else {
        newOptions.push(opt);
      }
    });
    dispatch(setOptions(newOptions));
  }, [dispatch, options.length, themeOptions]);

  const setValue = (idx, value) => {
    //create a new array with one option modified
    let newOptions = options.map((item, index) => {
      if (index !== idx) {
        return item;
      }

      return {
        ...item,
        value: value,
      };
    });

    console.log(newOptions);

    dispatch(setOptions(newOptions));
  };

  const saveOptions = () => {
    axios
      .post("/api/options/setoption", options, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          alert("Saved successfully.");
          dispatch(setOptions(res.data.options));
        }
      })
      .catch((err) => {
        const { message } = err.response.data;
        alert(message);
      });
  };

  return (
    <div className="admin-settings">
      <h1>Settings</h1>
      {options.map((option, idx) => {
        let optionInput = <></>;

        switch (option.type) {
          case optionTypes.TEXT:
            optionInput = (
              <input
                id={option._id}
                type="text"
                value={option.value}
                onChange={(e) => setValue(idx, e.target.value)}
              />
            );
            break;
          case optionTypes.THEME:
            optionInput = (
              <select
                id={option._id}
                onChange={(e) => setValue(idx, e.target.value)}
                defaultValue={option.value}
              >
                {themeFolders.map((folder) => {
                  return (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  );
                })}
              </select>
            );
            break;
          case optionTypes.RTE:
            optionInput = (
              <>
                <MyTextEditor
                  index={idx}
                  value={option.value}
                  onChange={setValue}
                />
              </>
            );
            break;
          default:
        }
        return (
          <div key={idx}>
            <label htmlFor={option._id}>{option.name}:</label> {optionInput}
          </div>
        );
      })}
      <input
        className="linkButton"
        type="submit"
        value="Save Settings"
        onClick={() => saveOptions()}
      />
    </div>
  );
}

export default Settings;
