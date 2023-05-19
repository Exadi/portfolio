import React from 'react'
import {useSelector} from 'react-redux'
import { findOption } from "../../utils/options";
import {optionNames} from "./themeOptions";

function Footer() {
  
  const options = useSelector((state) => state.content.options);
  const gitHubURL = findOption(options, optionNames.GITHUB_URL);
  return (
    <footer className="footer"><div className="wrapper"><h1>Footer</h1>
    <div className="social-links">{gitHubURL && gitHubURL.value !== "" ? (<a href={gitHubURL.value}><i class="fa-brands fa-github"></i></a>): null}</div></div></footer>
  )
}

export default Footer