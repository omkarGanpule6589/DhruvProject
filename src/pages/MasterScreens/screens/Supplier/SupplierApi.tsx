import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSupplierList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Supplier?$select=SupplierId,Supplier1,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getSupplierdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/Supplier?$filter=SupplierId eq ${id}&$select=Supplier1,Description,LastModifiedDateTime&$expand=LastModifiedUser,SupplierItems($filter=IsDeleted ne true)`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function UpdateSupplierdetails(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Supplier?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateSupplier( params) {
  const accessToken = getSessionToken();
  return api.post("/odata/Supplier", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}