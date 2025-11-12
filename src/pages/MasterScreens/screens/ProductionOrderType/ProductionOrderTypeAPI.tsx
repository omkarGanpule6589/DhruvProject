import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductionOrderTypeList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductionOrderType?$select=ProductionOrderTypeId,ProductionOrderTypeName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProductionOrderTypelDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductionOrderType?$filter=ProductionOrderTypeId eq ${id}&$select=ProductionOrderTypeName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditProductionOrderTypeetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductionOrderType?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateProductionOrderType(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProductionOrderType", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}