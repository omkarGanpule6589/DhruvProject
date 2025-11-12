import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";



export function Preprint(params) {
  const accessToken = getSessionToken();
  return api.post("svc/PrintLabelService/ReprintLabel", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}