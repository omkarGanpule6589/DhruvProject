import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductFamilyList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductFamily?$select=ProductFamilyId,ProductFamilyName,Description,StartQty,CreatedDateTime&$expand=CreatedUser` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductFamilyById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductFamily?$filter=ProductFamilyId eq ${id}&$expand=StartUom,TrainingReqGroup,NumberingRule,LastModifiedUser` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editProductFamily(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductFamily?key=${id}`, reqObj ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getTrainingRequirementGroupNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirementGroup?$select=TrainingRequirementGroupId,TrainingRequirementGroup1` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getNumberingRuleNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/NumberingRule?$select=NumberingRuleId,NumberingRuleName` ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateProductFamily(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProductFamily", params ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
