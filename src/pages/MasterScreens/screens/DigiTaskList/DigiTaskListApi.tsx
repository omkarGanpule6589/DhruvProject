import { api } from "../../../../components/API/apiConfig";

export function getDigiTaskList() {
  return api.get(`/odata/DigiTaskList?$select=DigiTaskListId`);
}

 