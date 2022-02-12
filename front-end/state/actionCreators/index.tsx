import { ActionType } from "../actionTypes";
import { Dispatch } from "redux";
import { Action as HeaderAction } from "../actions/headerActions";
import { Action as UserAction } from "../actions/userActions";

export const openSidebar = () => {
  return (dispatch: Dispatch<HeaderAction>) => {
    dispatch({ type: ActionType.OPEN_SIDEBAR });
  };
};

export const closeSidebar = () => {
  return (dispatch: Dispatch<HeaderAction>) => {
    dispatch({ type: ActionType.CLOSE_SIDEBAR });
  };
};

export const getUsers = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await fetch(
        "https://dummyapi.io/data/v1/user?limit=50",
        {
          method: "GET",
          headers: { "app-id": "6207d95d0d83d3b8d0e20499" },
        }
      );
      const { data } = await response.json();
      dispatch({ type: ActionType.IS_LOADING });
      dispatch({ type: ActionType.GET_USERS, payload: data });
    } catch (err) {
      dispatch({ type: ActionType.IS_ERROR });
      console.log(err);
    }
  };
};
