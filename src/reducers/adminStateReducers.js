import { SET_SIDEBAR_OPEN } from "../actions/types";
const initialState = {
  sidebarOpen: false,
};
export default function authReducers(state = initialState, action) {
  switch (action.type) {
    case SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: action.payload,
      };
    default:
      return state;
  }
}
