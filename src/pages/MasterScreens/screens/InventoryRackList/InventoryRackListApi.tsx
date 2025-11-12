import { api } from "../../../../components/API/apiConfig";

export function getInventoryRackList() {
  return api.get(`/odata/InventoryRackList?$select=InventoryRackListId,Rack`);
}

export function getInventoryRackById(id) {
  return api.get(
    `/odata/InventoryRackList?$filter=InventoryRackListId eq ${id}&$select=InventoryLocationId,Rack`
  );
}

export function editInventoryRack(id, reqObj) {
  return api.patch(`/odata/InventoryRackList?key=${id}`, reqObj);
}

export function getInventoryLocation() {
  return api.get(
    `/odata/InventoryLocation?$select=InventoryLocationId,InventoryLocation1`
  );
}
export function CreateInventoryRackList(params) {
  return api.post("/odata/InventoryRackList", params);
}
