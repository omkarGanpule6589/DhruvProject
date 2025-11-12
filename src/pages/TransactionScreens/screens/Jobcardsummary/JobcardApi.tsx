import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getJobCardsummary(params) {
    const accessToken = getSessionToken();
    return api.post("svc/JobcardSummaryService/JobcardSummaryOnJobCard", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }