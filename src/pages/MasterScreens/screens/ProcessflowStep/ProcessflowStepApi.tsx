import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProcessflowStepList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProcessflowStep?$select=ProcessflowStepId,ProcessflowStepName,Description` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProcessflowStepDetailDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProcessflowStep?$filter=ProcessflowStepId eq ${id}&$select=ProcessflowStepName,Description,OperationDetailId,IsOpDetActiveRev,Sequence,ProcessflowId,IsProcessflowActiveRev,IsBiginStep,IsEndStep,IsDefaultStep,IsReworkStep` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditProcessflowStepdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProcessflowStep?key=${id}`, reqObj ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateProcessflowStep(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProcessflowStep", params ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getOperationDetailListforProcessflowstep() {
  const accessToken = getSessionToken();
  return api.get(`/odata/OperationDetail?$select=OperationDetailId,OperationDetailName,Description` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProcessflowforProcessflowstep() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Processflow?$select=ProcessflowId,ProcessflowName` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}