import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getLossReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReasonGroup?$select=LossReasonGroupId,LossReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getLossReasonGroupdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReasonGroup?$filter=LossReasonGroupId eq ${id}&$select=LossReasonGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,LossReasonGroupEntries($expand=LossReason;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editLossReasongroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/LossReasonGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateLossReasongroupdetails(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/LossReasonGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getLossReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReason?$select=LossReasonId,LossReasonName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}