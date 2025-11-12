import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDefectCodeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DefectCode?$select=DefectCodeId,DefectCodeName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDefectCodeById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DefectCode?$filter=DefectCodeId eq ${id}&$select=DefectCodeId,DefectCodeName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editDefectCode(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DefectCode?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateDefectCode(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/DefectCode", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
