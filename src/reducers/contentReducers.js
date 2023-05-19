import { SET_OPTIONS, SET_THEME_FOLDERS } from "../actions/types";

const initialState = {
  options: [],
};
export default function contentReducers(state = initialState, action) {
  switch (action.type) {
    case SET_OPTIONS:
      return {
        ...state,
        options: action.payload,
      };
    case SET_THEME_FOLDERS:
      return { ...state, themeFolders: action.payload };
    default:
      return state;
  }
}
