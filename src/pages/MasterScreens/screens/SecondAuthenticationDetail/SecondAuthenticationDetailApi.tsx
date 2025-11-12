import { api } from "../../../../components/API/apiConfig";

export function getSecondAuthDetailList() {
  return api.get(
    `/odata/SecondAuthenticationDetail?$select=SecondAuthenticationDetailId,Count,VerificationMethod`
  );
}

export function getSecondaryAuthDetailById(id) {
  return api.get(
    `/odata/SecondAuthenticationDetail?$filter=SecondAuthenticationDetailId eq ${id}`
  );
}

export function editSecondaryAuthDetail(id, reqObj) {
  return api.patch(`/odata/SecondAuthenticationDetail?key=${id}`, reqObj);
}
export function CreateSecondAuthDetaildetails(params) {
  return api.post("/odata/SecondAuthenticationDetail", params);
}

export function getSecondAuthenticationNames() {
  return api.get(
    `/odata/SecondAuthentication?$select=SecondAuthenticationId,SecondAuthentication1`
  );
}

export function getRoleNames() {
  return api.get(`/odata/Role?$select=RoleId,RoleName`);
}

export function getEsigMeaningNames() {
  return api.get(`/odata/EsigMeaning?$select=EsigMeaningId,EsigMeaning1`);
}
