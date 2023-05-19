import { SET_SIDEBAR_OPEN } from "./types";

export const setSideBarOpen = (sidebarOpen) => (dispatch) => {
  dispatch({
    type: SET_SIDEBAR_OPEN,
    payload: sidebarOpen,
  });
};
