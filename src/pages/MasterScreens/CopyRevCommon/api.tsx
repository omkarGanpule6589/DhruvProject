import { api } from "../../../components/API/apiConfig";
import { getSessionToken } from "../../../components/AuthUser";

export function CopyRevData(apiEndPoint, body) {
  const accessToken = getSessionToken();
  return api.post(apiEndPoint, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CopyobjData(apiEndPoint, body) {
  const accessToken = getSessionToken();
  return api.post(apiEndPoint, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
