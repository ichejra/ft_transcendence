import { ActionType } from "../actionTypes";
import { User, Action } from "../actions/userActions";

interface State {
  isLoading: boolean;
  isError: boolean;
  users: User[];
}

const initialState: State = {
  isLoading: true,
  isError: false,
  users: [],
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.IS_LOADING: {
      return { ...state, isLoadding: true };
    }
    case ActionType.IS_ERROR: {
      return { ...state, isLoadding: false, isError: true };
    }
    case ActionType.GET_USERS: {
      return { ...state, users: action.payload, isLoading: false };
    }
    case ActionType.UPDATE_USER: {
      return { ...state };
    }
    default:
      return state;
  }
};

export default reducer;
