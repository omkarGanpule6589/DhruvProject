import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getComponentRemovalReason() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ComponentRemovalReason?$select=ComponentRemovalReasonId,CompRemovalReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getComponentRemovalReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ComponentRemovalReason?$filter=ComponentRemovalReasonId eq ${id}&$select=ComponentRemovalReasonId,CompRemovalReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editComponentRemovalReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ComponentRemovalReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateComponentRemovalReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ComponentRemovalReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
