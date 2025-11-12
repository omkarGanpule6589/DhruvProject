import { api } from "../../../../components/API/apiConfig";

export function getTenantList() {
  return api.get(
    `/odata/Tenant?$select=Id,Name,SubscriptionStartDate,SubscriptionEndDate`
  );
}
export function getTenantDetails(id) {
  return api.get(`/odata/Tenant?$filter=Id eq ${id}`);
}
export function editTenantDetails(id, reqObj) {
  return api.patch(`/odata/Tenant?key=${id}`, reqObj);
}
export function CreateTenant(params) {
  return api.post("/odata/Tenant", params);
}
