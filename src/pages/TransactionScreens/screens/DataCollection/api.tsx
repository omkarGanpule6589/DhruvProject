import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getroutecardlist() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/DataCollectionService/BindRouteCards`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getdatafields(params) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/DataCollectionService/GetDataCollectionDetails",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function Postdatacollect(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DataCollectionService/DataCollection", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
