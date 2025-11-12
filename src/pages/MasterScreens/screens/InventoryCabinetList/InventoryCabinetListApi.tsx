import { api } from "../../../../components/API/apiConfig";

export function getInventoryCabinetList() {
  return api.get(`/odata/InventoryCabinetList?$select=InventoryCabinetListId,Cabinet`);
}

export function getInventoryCabinetdetailsFetch(id) {
  return api.get(`/odata/InventoryCabinetList?$filter=InventoryCabinetListId eq ${id}`)
  
}