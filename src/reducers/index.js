import { combineReducers } from "redux";
import adminStateReducers from "./adminStateReducers";
import authReducer from "./authReducers";
import contentReducers from "./contentReducers";
export default combineReducers({
  admin: adminStateReducers,
  auth: authReducer,
  content: contentReducers,
});
