import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getbonusReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/bonusReasonGroup?$select=GainReasonGroupId,GainReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getbonusReasonGroupDetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/bonusReasonGroup?$filter=GainReasonGroupId eq ${id}&$expand=LastModifiedUser,GainReasonGroupEntries($expand=GainReason;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditbonusReasonGroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/bonusReasonGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreatebonusReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/bonusReasonGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getBonusReasonList1() {
    const accessToken = getSessionToken();
    return api.get(
      `odata/BonusReason?$select=GainReasonId,GainReasonName,Description`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

