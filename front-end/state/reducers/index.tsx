import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import headerReducer from "./headerReducer";

const reducers = combineReducers({
  usersReducer,
  headerReducer,
});

export default reducers;

// interpert whatever type that we passed in the brackets
export type State = ReturnType<typeof reducers>;
