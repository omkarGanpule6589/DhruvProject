import { api } from "../../../../components/API/apiConfig";

export function getBomList() {
  return api.get(`/odata/HistoryMainLine`);
}