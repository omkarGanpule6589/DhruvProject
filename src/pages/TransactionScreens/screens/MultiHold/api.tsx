import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getHoldCheck(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MultiHoldService/MultiHoldValidate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function PostMultihold(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MultiHoldService/MultiHold", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
