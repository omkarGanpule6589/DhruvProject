import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getPrintQueueList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/PrintQueue?$select=PrintQueueId,PrintQueueName,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getPrintQueueById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/PrintQueue?$filter=PrintQueueId eq ${id}&$select=PrintQueueName,PrintQueue1,PrintQueuePath,PrintFilePath,EncodingType,OutputToFile,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editPrintQueue(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/PrintQueue?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createPrintQueue(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/PrintQueue`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
