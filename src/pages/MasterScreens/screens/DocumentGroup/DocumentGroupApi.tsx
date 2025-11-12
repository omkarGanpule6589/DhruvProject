import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDocumentGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DocumentGroup?$select=DocumentGroupId,DocumentGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDocumentList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Document`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDocumentGroupById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DocumentGroup?$filter=DocumentGroupId eq ${id}&$select=DocumentGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,DocumentGroupEntries($expand=Document;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editDocumentGroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DocumentGroup?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateDocumentGroupdetails(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/DocumentGroup", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
