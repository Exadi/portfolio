import React from "react";
import { findOption, defaultOptions } from "../../utils/options";
import { connect } from "react-redux";
import "./style.scss";
import styles from "./HomePage.module.scss";
import ViewCategory from "./ViewCategory";
import { optionNames } from "./themeOptions";

function HomePage(props) {
  const options = props.options;

  return (
    <div className="homepage">
      <div className={styles["site-header"]}>
        <h1>
          {options.length > 0
            ? findOption(options, defaultOptions.headerText.name).value
            : "Loading..."}
        </h1>
      </div>
      <section className="diagonal reverse about-me">
        <h2 className="outlined">About Me</h2>
        <p
          dangerouslySetInnerHTML={{
            __html: findOption(options, optionNames.ABOUT_ME)?.value,
          }}
        ></p>
      </section>
      <ViewCategory className={"diagonal"} category="projects" />
      <ViewCategory className={"diagonal reverse"} category="ai-stories" />
    </div>
  );
}

const mapState = (state) => ({
  options: state.content.options,
});

const connector = connect(mapState);

export default connector(HomePage);
