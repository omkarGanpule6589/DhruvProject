import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEsigMeaningList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthenticationMeaning?$select=SecondAuthenticationMeaningId,SecondAuthenticationMeaning1,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getEsigMeaningDetails(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SecondAuthenticationMeaning?$filter=SecondAuthenticationMeaningId eq ${id}&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editEsigMeaning(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SecondAuthenticationMeaning?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateEsigMeaning(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SecondAuthenticationMeaning", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}