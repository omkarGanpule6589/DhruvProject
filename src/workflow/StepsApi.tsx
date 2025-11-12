import { api } from "../components/API/apiConfig";
import { getSessionToken } from "../components/AuthUser";

export function getProcessflowsteplist() {
  const accessToken = getSessionToken();
  return api.get(`odata/ProcessflowStep`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function steps(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Processflow?$filter=ProcessflowId eq ${id}&$expand=ProcessflowSteps($expand=OperationDetail,AlternateStepDetailAlternateSteps($expand=ProcessflowStep),ReworkStepDetailReworkSteps($expand=ProcessflowStep);$filter=IsDeleted ne true)&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
