import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getNumberingruleList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/NumberingRule?$select=NumberingRuleId,NumberingRuleName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getNumberingruledetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/NumberingRule?$filter=NumberingRuleId eq ${id}&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditNumberingRuledetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/NumberingRule?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateNumberingRule(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/NumberingRule", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
