import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getReworkEngineList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ReworkEngine?$expand=processflow,CreatedUser,FromProcessflowStep,ToProcessflowStep`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}


export function getReworkEngineById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ReworkEngine?$filter=processflowId eq ${id}&$expand=processflow,Defectcode,FromProcessflowStep,ToProcessflowStep`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editReworkConfiguration(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ReworkEngine?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProcessFlowById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Processflow?$filter=ProcessflowId eq ${id}&$select=ProcessflowId,ProcessflowName,&$expand=ProcessflowSteps($filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function createReworkConfiguration(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/ReworkEngine`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}