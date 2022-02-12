import { ActionType } from "../actionTypes";
import { Action } from "../actions/headerActions";

interface State {
  isSidebarOpen: boolean;
}

const initialState: State = {
  isSidebarOpen: false,
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.OPEN_SIDEBAR: {
      return { ...state, isSidebarOpen: true };
    }
    case ActionType.CLOSE_SIDEBAR: {
      return { ...state, isSidebarOpen: false };
    }
    default:
      return state;
  }
};

export default reducer;
