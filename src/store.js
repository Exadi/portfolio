import { configureStore } from "@reduxjs/toolkit";

import adminStateReducers from "./reducers/adminStateReducers";
import authReducer from "./reducers/authReducers";
import contentReducers from "./reducers/contentReducers";

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
const initialState = {};
const middleware = [thunk];
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const store = configureStore({
  // Automatically calls `combineReducers`
  reducer: {
    admin: adminStateReducers,
    auth: authReducer,
    content: contentReducers,
  },
});

export default store;
