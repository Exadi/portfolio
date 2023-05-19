import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Login";
import { connect, useSelector, useDispatch } from "react-redux";
import { findOption, defaultOptions } from "../utils/options";
import { setOptions, setThemeFolders } from "../actions/contentActions";

function FrontEndRoot(props) {
  /*Switch that contains the frontend components only and also adds a footer and container div to all of them*/
  const { components } = props;
  return (
    <>
      <div className="main-content">
        <Switch>
          <Route exact path="/" component={components.HomePage} />
          <Route path="/categories" component={components.ViewCategory} />
          {/*I guess if we don't hit any of the other routes, assume we're looking for a post*/}
          <Route path="/" component={components.ViewPost} />
        </Switch>
      </div>

      <components.Footer />
    </>
  );
}

function Root(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false); //for mobile
  const toggleSidebarOpen = () => setSidebarOpen(!sidebarOpen);
  const dispatch = useDispatch();

  const options = useSelector((state) => state.content.options);
  const themeOption = findOption(options, defaultOptions.theme.name);

  const themesContext = require.context("../themes", true, /\.jsx?$/);

  const folderNames = [];
  const themeComponents = {};
  themesContext.keys().forEach((key) => {
    const folderName = key.replace(/^\.\/(.*?(?=\/))\/.*$/, "$1");
    const componentName = key.replace(/^.+\/([^/]+)\.jsx?$/, "$1");

    /*console.log(`${folderName} -  ${componentName}`);*/
    if (!folderNames.includes(folderName)) folderNames.push(folderName);
    if (!themeComponents[folderName]) themeComponents[folderName] = {};
    themeComponents[folderName][componentName] = themesContext(key).default;
  });

  dispatch(setThemeFolders(folderNames));

  /* assign components to variables, falling back to the default theme's component if the selected theme doesn't have its own copy of the component */
  const themeName = themeOption ? themeOption.value : "default";
  const components = {};

  components.HomePage =
    themeComponents[themeName] && themeComponents[themeName].HomePage
      ? themeComponents[themeName].HomePage
      : themeComponents["default"].HomePage;

  components.ViewCategory =
    themeComponents[themeName] && themeComponents[themeName].ViewCategory
      ? themeComponents[themeName].ViewCategory
      : themeComponents["default"].ViewCategory;

  components.ViewPost =
    themeComponents[themeName] && themeComponents[themeName].ViewPost
      ? themeComponents[themeName].ViewPost
      : themeComponents["default"].ViewPost;

  components.Admin =
    themeComponents[themeName] && themeComponents[themeName].Admin
      ? themeComponents[themeName].Admin
      : themeComponents["default"].Admin;

  components.AdminHeader =
    themeComponents[themeName] && themeComponents[themeName].AdminHeader
      ? themeComponents[themeName].AdminHeader
      : themeComponents["default"].AdminHeader;

  components.Footer =
    themeComponents[themeName] && themeComponents[themeName].Footer
      ? themeComponents[themeName].Footer
      : themeComponents["default"].Footer;

  useEffect(() => {
    if (props.options && props.options.length > 0) {
      const titleOption = findOption(props.options, defaultOptions.title.name);
      if (titleOption) document.title = titleOption.value;
    }
  }, [props.options]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <components.AdminHeader toggleSidebarOpen={toggleSidebarOpen} />

        <Switch>
          <Route path="/admin" component={components.Admin} />
          <Route exact path="/login" component={Login} />
          {/*If it's not the admin/login route it's a frontend route 
          - which adds some things like the footer to all of those routes*/}
          <Route
            path="/"
            render={() => <FrontEndRoot components={components} />}
          />
        </Switch>
      </Suspense>
    </Router>
  );
}

const mapState = (state) => ({
  options: state.content.options,
});

const connector = connect(mapState);

export default connector(Root);
