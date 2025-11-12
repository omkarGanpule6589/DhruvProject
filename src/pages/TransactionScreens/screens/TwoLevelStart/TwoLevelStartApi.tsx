import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";



export function GetChildRouteCards(params) {
  const accessToken = getSessionToken();
  return api.post("svc/StartTwoLevelService/GenerateChildRouteCards", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function Twolevelstarttransaction(params) {
  const accessToken = getSessionToken();
  return api.post("svc/StartTwoLevelService/StartTwoLevel", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}