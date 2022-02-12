import { ActionType } from "../actionTypes";

interface OpenSidebarAction {
  type: ActionType.OPEN_SIDEBAR;
}

interface CloseSidebarAction {
  type: ActionType.CLOSE_SIDEBAR;
}

export type Action = OpenSidebarAction | CloseSidebarAction;
