import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { findOption } from "../../utils/options";
import { optionNames } from "./themeOptions";
import { FaGithub } from "react-icons/fa";
import axios from "axios";

/*TODO try to find a way so I don't need to manually specify height to get the footer to stick to the bottom of the screen. 
Make sure it works on mobile too.*/
function Footer() {
  const options = useSelector((state) => state.content.options);
  const contactFormHandler = findOption(
    options,
    optionNames.CONTACT_EMAIL
  )?.value;
  let recaptchaSiteKey = findOption(options, optionNames.RECAPTCHA)?.value;
  const gitHubURL = findOption(options, optionNames.GITHUB_URL);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const token = document.getElementById("g-recaptcha-response").value;
    if (formData.message.length >= 20) {
      axios
        .post(contactFormHandler, {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          "g-recaptcha-response": token,
        })
        .then(() => {
          console.log("Form submitted successfully");
          setFormSuccess(true);
        })
        .catch((error) => {
          console.error("Form submission error:", error);
          // handle form submission error
        });
    } else alert("Please enter a message long enough to contain some meaning.");
  };

  useEffect(() => {
    const script = document.createElement("script");
    if (recaptchaSiteKey) {
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("reCAPTCHA API script loaded");
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(recaptchaSiteKey, { action: "submit" })
            .then((token) => {
              console.info("got token: " + token);
              const el = document.getElementById("g-recaptcha-response");
              if (el) el.value = token;
            });
        });
      };

      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [recaptchaSiteKey]);

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
          <p>
            You may remain anonymous if you do not want a response; only message
            is required.
          </p>
          {formSuccess ? (
            <div>Thank you for your message!</div>
          ) : (
            <form onSubmit={handleSubmit} id="contact-form">
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
                type="hidden"
                id="g-recaptcha-response"
                name="g-recaptcha-response"
              />
              <input
                type="submit"
                className="linkButton"
                style={{ margin: "0.1rem auto" }}
              ></input>
            </form>
          )}
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
