import { api } from "../../../../components/API/apiConfig";

export function getActionItemList() {
  return api.get(`/odata/ActionItem?$Select=ActionItemId,Action,ActionType`);
}
export function getActionItemDetails(id) {
  return api.get(`/odata/ActionItem?$filter=ActionItemId eq ${id}`);
}
