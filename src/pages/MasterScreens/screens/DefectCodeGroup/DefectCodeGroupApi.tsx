import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDefectCodeGroupListt() {
  const accessToken = getSessionToken();
  return api.get(`/odata/DefectCodeGroup?$select=DefectCodeGroupId,DefectCodeGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDefectCodeGroupDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/DefectCodeGroup?$filter=DefectCodeGroupId eq ${id}&$expand=LastModifiedUser,DefectCodeGroupEntries($expand=DefectCode;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
}
export function EditDefectCodeGroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DefectCodeGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateDefectCodeGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/DefectCodeGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


export function getDefectCodeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DefectCode?$select=DefectCodeId,DefectCodeName,`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    
  );
}