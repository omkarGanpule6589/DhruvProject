import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductionOrderStatusList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductionOrderStatus?$select=ProductionOrderStatusId,ProductionOrderStatusName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProductionOrderStatuslDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductionOrderStatus?$filter=ProductionOrderStatusId eq ${id}&$select=ProductionOrderStatusName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditProductionOrderStatusDetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductionOrderStatus?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateProductionOrderStatus(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProductionOrderStatus", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}