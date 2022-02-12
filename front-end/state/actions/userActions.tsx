import { ActionType } from "../actionTypes";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  picture: string;
}

interface IsLoadingAction {
  type: ActionType.IS_LOADING;
}

interface IsErrorAction {
  type: ActionType.IS_ERROR;
}

interface GetUsersAction {
  type: ActionType.GET_USERS;
  payload: User[];
}

interface UpdateUserAction {
  type: ActionType.UPDATE_USER;
  payload: string;
}

export type Action =
  | IsLoadingAction
  | IsErrorAction
  | GetUsersAction
  | UpdateUserAction;
