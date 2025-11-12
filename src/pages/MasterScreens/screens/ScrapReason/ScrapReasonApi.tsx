import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getScrapReasonList() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/ScrapReason?Select=ScrapReasonId,ScrapReasonName,Description,CreatedDateTime&$expand=CreatedUser` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function UpdateScrapReason(id, params) {
  const accessToken = getSessionToken();

  return api.patch(`/odata/ScrapReason?key=${id}`, params ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateScrapReason(params) {
  const accessToken = getSessionToken();

  return api.post("/odata/ScrapReason", params ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getScrapReasonbyid(id) {
  const accessToken = getSessionToken();

  return api.get(`/odata/ScrapReason?$filter=ScrapReasonId eq ${id}&$expand=LastModifiedUser` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
// export function editDefectCode(id, reqObj) {
//   return api.patch(`/odata/DefectCode?key=${id}`, reqObj);
// }
