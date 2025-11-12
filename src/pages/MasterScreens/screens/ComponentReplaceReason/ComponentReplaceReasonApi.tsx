import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getHoldComponentReplaceReasonsList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ComponentReplaceReasons?$select=ComponentReplaceReasonId,ComponentReplaceReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getComponentReplaceReasonsDetails(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentReplaceReasons?$filter=ComponentReplaceReasonId eq ${id}&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editComponentReplaceReasons(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ComponentReplaceReasons?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateComponentReplaceReasons(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ComponentReplaceReasons", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
