import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

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


  export function getEmployeetrainingdetails(id) {
    const accessToken = getSessionToken();
    return api.get(
      `/odata/EmployeeTrainingDetail?$filter=trainingRequirementId eq ${id}&$expand=Employee,TrainingRequirement,Trainer`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
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
  export function getTriner(id) {
    const accessToken = getSessionToken();
    return api.get(
      `/odata/trainerdetail?$filter=TrainingReqId eq ${id}&$expand=Employee`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }


  export function createEmployeetraingReq(reqObj) {
    const accessToken = getSessionToken();
    return api.post(`/odata/EmployeeTrainingDetail`, reqObj, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }


  export function getEmployeetrainingdetailsList() {
    const accessToken = getSessionToken();
    return api.get(
      `/odata/EmployeeTrainingDetail?$expand=Employee,TrainingRequirement,Trainer`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }


  export function UpdateEmployeeTrainingdetails(id, params) {
    const accessToken = getSessionToken();
    return api.patch(`/odata/EmployeeTrainingDetail?key=${id}`, params,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }