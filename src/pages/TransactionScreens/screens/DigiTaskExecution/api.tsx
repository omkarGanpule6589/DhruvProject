import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getactionlists(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DigiTaskService/GetActionList", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getactionitems(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DigiTaskService/GetActionItems", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
