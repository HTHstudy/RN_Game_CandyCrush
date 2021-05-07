import { combineReducers } from "redux";
import itemReducer from "./items";
import levelReducer from "./level"
// Combine reducers
const itemApp = combineReducers({
  itemReducer,
  levelReducer,
});

export default itemApp;
