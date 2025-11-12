import { api } from "../../../components/API/apiConfig";
import { getSessionToken } from "../../../components/AuthUser";

export function DeleteData(apiEndPoint) {
  const accessToken = getSessionToken();
  return api.delete(apiEndPoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
