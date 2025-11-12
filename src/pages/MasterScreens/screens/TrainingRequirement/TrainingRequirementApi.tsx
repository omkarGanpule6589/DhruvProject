import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getTrainingRequirementList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirement?$Select=TrainingRequirementId,TrainingRequirementName,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getTrainingRequirementById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/TrainingRequirement?$filter=TrainingRequirementId eq ${id}&$expand=TrainerDetails($expand=Employee;$filter=IsDeleted ne true),DocumentGroup,LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function UpdateTrainingRequirement(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/TrainingRequirement?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createTrainingRequirement(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/TrainingRequirement`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDocumentNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/DocumentGroup?$select=DocumentGroupId,DocumentGroupName`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEmployeeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Employee?$select=EmployeeId,EmployeeName`,
    {
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
