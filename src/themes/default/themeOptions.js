//a list of options this theme makes use of that are non-standard.
//these will be added to the settings page if they are not yet saved to the database
export const optionNames = { GITHUB_URL: "GitHub URL", ABOUT_ME: "About Me" };
const themeOptions = [
  { name: optionNames.GITHUB_URL, value: "", type: "text" },
  { name: optionNames.ABOUT_ME, value: "", type: "rte" },
];

export default themeOptions;
