import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getBusinessUniteList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/BusinessUnit?$select=BusinessUnitId,BusinessUnitName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getBusinessUnitdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/BusinessUnit?$filter=BusinessUnitId eq ${id}&$select=BusinessUnitName,Description,TrainingReqGroupId,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
}

export function EditBusinessUnitedetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/BusinessUnit?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateBusinessUnit(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/BusinessUnit", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getTrainingRequirementGroupNamesforBusinessUnit() {
  const accessToken = getSessionToken();
    return api.get(
      `/odata/TrainingRequirementGroup?$select=TrainingRequirementGroupId,TrainingRequirementGroup1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }