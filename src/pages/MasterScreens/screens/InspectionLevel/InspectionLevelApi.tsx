import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getInspectionLevelList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/InspectionLevel?$select=InspectionLevelId,InspectionLevelName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getInspectionLevelDetails(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/InspectionLevel?$filter=InspectionLevelId eq ${id}&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editInspectionLevel(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/InspectionLevel?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateInspectionLevel(params) {
  const accessToken = getSessionToken();
  return api.post(`/odata/InspectionLevel`, params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
