import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function Download(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`svc/DocumentService/ExcelFileDownloadFun`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function Upload(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/svc/DocumentService/ExcelFileUploadFun`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
