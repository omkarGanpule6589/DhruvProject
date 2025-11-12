import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function FusedButtonlist() {
    const accessToken = getSessionToken();
    return api.get(`odata/FusedButton`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }


  export function LensUILButtonTabout(params) {
    const accessToken = getSessionToken();
    return api.post("svc/LensButtonStartService/LensUILButtonTabout", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  export function LensUILButtonStart(params) {
    const accessToken = getSessionToken();
    return api.post("svc/LensButtonStartService/LensUILButtonStart", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  
  