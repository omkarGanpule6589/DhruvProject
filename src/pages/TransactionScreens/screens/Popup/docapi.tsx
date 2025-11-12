import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function DocData(body) {
  const accessToken = getSessionToken();
  return api.post("svc/RoutecardDocumentsService/DocumentsRouteCard", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function InsData(opId, proId) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/WorkInstruction?filter=OperationId eq ${opId} and ProductId eq ${proId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
