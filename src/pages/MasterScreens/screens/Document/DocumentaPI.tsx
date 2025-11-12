import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDocumentList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Document?$select=DocumentId,DocumentName,Description,Revision,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getDocumentDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Document?$filter=DocumentId eq ${id}&$select=DocumentName,Description,Revision,ActiveRevision,ViewMode,FilePath,LastModifiedDateTime&$expand=LastModifiedUser,DocumentRoleDetails($expand=role;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditDocumentdetails(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`svc/DocumentService/PatchDocumentRecord`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateDocument(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DocumentService/InsertDocument", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
