import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { findOption } from "../../utils/options";
import { optionNames } from "./themeOptions";
import { FaGithub } from "react-icons/fa";

function Footer() {
  const options = useSelector((state) => state.content.options);
  const contactFormHandler = findOption(options, optionNames.CONTACT_EMAIL);
  const gitHubURL = findOption(options, optionNames.GITHUB_URL);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const contactSubmit = () => {
    axios.post(contactFormHandler, {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
  };

  return (
    <footer className="footer">
      <div className="wrapper">
        <div className="contact-form">
          <h2>Contact Me</h2>
          {
            /*it should be noted that if the name of the repo isn't exactly "portfolio", the link won't work*/
            gitHubURL && gitHubURL.value !== "" ? (
              <p>
                Please use{" "}
                <a href={`${gitHubURL.value}/portfolio/issues`}>
                  GitHub issues
                </a>{" "}
                for any feedback related to the site itself. For any other
                reason, use the form below.
              </p>
            ) : null
          }
          <form
            onSubmit={(e) => {
              e.preventDefault();
              contactSubmit();
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
            />
            <input
              type="submit"
              className="linkButton"
              style={{ margin: "0.1rem auto" }}
            ></input>
          </form>
        </div>

        <div className="social-links">
          {gitHubURL && gitHubURL.value !== "" ? (
            <a href={gitHubURL.value}>
              <FaGithub />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
