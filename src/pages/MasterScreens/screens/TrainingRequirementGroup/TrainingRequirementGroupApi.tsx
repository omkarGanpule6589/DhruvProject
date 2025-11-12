import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getTrainingRequirementGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirementGroup?$Select=TrainingRequirementGroupId,TrainingRequirementGroup1,Description,CreatedDateTime&$expand=CreatedUser
`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getTrainingRequirementGroupDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirementGroup?$filter=TrainingRequirementGroupId eq ${id}&$expand=TrainingReqGroupDetails($expand=TrainingReq;$filter=IsDeleted ne true),LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editTrainingRequirementGroup(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/TrainingRequirementGroup?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateTrainingRequirementGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/TrainingRequirementGroup", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getTrainingRequirementList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirement?$Select=TrainingRequirementId,TrainingRequirementName,Description`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
