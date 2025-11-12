import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDataCollDefList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName,Description,FailAction,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDataCollDefById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DataCollectionDef?$filter=DataCollectionDefId eq ${id}&$select=DataCollectionName,Description,IsActive,FailAction,EmailAddress,HoldReasonId,LastModifiedDateTime&$expand=LastModifiedUser,HoldReason&$expand=Datapoints(expand=Uom;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editDataCollDef(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DataCollectionDef?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getHoldReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldReason?$select=HoldReasonId,HoldReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createDataCollDef(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/DataCollectionDef`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDataCollCetionataPointsbyId(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DataCollectionDef?$filter=DataCollectionDefId eq ${id}&$expand=datapoints`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
