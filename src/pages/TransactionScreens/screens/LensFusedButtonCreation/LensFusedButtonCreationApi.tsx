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

  export function LensFusedButtonTabout(params) {
    const accessToken = getSessionToken();
    return api.post("svc/LensButtonStartService/LensFusedButtonTabout", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  export function LensFusedButtonSubmit(params) {
    const accessToken = getSessionToken();
    return api.post("svc/LensButtonStartService/LensFusedButtonStart", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  