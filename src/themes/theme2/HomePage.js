import React from "react";
import { findOption, defaultOptions } from "../../utils/options";
import { connect } from "react-redux";
import styles from "./HomePage.module.scss";

function HomePage(props) {
  const options = props.options;

  return (
    <div className={styles["home-page"]}>
      <div className={styles["site-header"]}>
        {options.length > 0
          ? findOption(options, defaultOptions.headerText.name).value
          : "Loading..."}
      </div>
      <div>This is theme 2.</div>
    </div>
  );
}

const mapState = (state) => ({
  options: state.content.options,
});

const connector = connect(mapState);

export default connector(HomePage);
