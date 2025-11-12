import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getUnitLevelList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/UnitLevel?$select=UnitLevelId,UnitLevel1,Description,RouteCardToStart,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUnitLevelById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/UnitLevel?$filter=UnitLevelId eq ${id}&$select=UnitLevelId,UnitLevel1,Description,RouteCardToStart,NumberingRuleId,LastModifiedDateTime&$expand=NumberingRule,LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editUnitLevel(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/UnitLevel?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getNumberingRule() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/NumberingRule?$select=NumberingRuleId,NumberingRuleName`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function createUnitLevel(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/UnitLevel`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
