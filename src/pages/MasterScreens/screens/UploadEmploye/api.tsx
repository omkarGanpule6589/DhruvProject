import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function Download(reqObj) {
    debugger
  const accessToken = getSessionToken();
  return GKBapi.post(`api/vs/CustomerDownloadTemplate?fileName=Role`,reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function Upload(reqObj) {
  const accessToken = getSessionToken();
  return GKBapi.post(`api/vs/CTravellerEmployeeUpload?objectName=Employee`,reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function UpDate(reqObj) {
  const accessToken = getSessionToken();
  return GKBapi.post(`api/vs/CTravellerEmployeeUpdate?objectName=Employee`,reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

