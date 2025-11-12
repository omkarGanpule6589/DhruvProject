import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getComponentIssueList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentIssueCode?$select=ComponentIssueCodeId,ComponentIssueCode1,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getComponentIssuedetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentIssueCode?$filter=ComponentIssueCodeId eq ${id}&$select=ComponentIssueCode1,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function editComponentIssuecode(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ComponentIssueCode?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateComponentIssuecode(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ComponentIssueCode", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
