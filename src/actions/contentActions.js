import { SET_OPTIONS, SET_THEME_FOLDERS } from "../actions/types";
export const setOptions = (options) => (dispatch) => {
  dispatch({
    type: SET_OPTIONS,
    payload: options,
  });
};

export const setThemeFolders = (themeFolders) => (dispatch) => {
  dispatch({
    type: SET_THEME_FOLDERS,
    payload: themeFolders,
  });
};
