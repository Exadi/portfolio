const defaultOptions = {
  title: { name: "Site Title", value: "New Site" },
  headerText: { name: "Header Text", value: "Website under construction." },
  theme: { name: "Theme", value: "default" },
};

const optionTypes = {
  TEXT: "text",
  DROPDOWN: "dropdown",
  THEME: "theme",
  RTE: "rte",
};

const findOption = (options, optionName) => {
  return options.find((option) => {
    return option.name === optionName;
  });
};
export { findOption, defaultOptions, optionTypes };
