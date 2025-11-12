import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getInventoryLocationList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/InventoryLocation?$select=InventoryLocationId,InventoryLocation1,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getInventoryLocationDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/InventoryLocation?$filter=InventoryLocationId eq ${id}&$expand=LastModifiedUser,InventoryCabinetLists($filter=IsDeleted ne true),InventoryRackLists($filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditInventoryLocationdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/InventoryLocation?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateInventoryLocation(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/InventoryLocation", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
