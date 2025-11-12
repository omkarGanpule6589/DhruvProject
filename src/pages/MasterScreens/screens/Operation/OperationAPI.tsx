import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getOperationList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Operation?$select=OperationId,OperationName,OperationDescription,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editOperation(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Operation?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createOperation(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`odata/Operation`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getBusinessUnitList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BusinessUnit?$select=BusinessUnitId,BusinessUnitName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getLossReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/LossReasonGroup?$select=LossReasonGroupId,LossReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDefectCodeGroup() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DefectCodeGroup?$select=DefectCodeGroupId,DefectCodeGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getBonusReasonGroup() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BonusReasonGroup?$select=GainReasonGroupId,GainReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function buyReasonGroup() {
  const accessToken = getSessionToken();
  return api.get(`/odata/BuyReason?$select=BuyReasonId,BuyReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getSecondAuthentication() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthentication?$select=SecondAuthenticationId,SecondAuthentication1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getReworkReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ReworkReasonGroup?$select=ReworkReasonGroupId,ReworkReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getSellReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SellReasonGroup?$select=SellReasonGroupId,SellReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getInventoryLocationList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/InventoryLocation?$select=InventoryLocationId,InventoryLocation1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getBonusReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BonusReasonGroup?$select=BonusReasonGroupId,BonusReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getBuyReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BuyReasonGroup?$select=BuyReasonGroupId,BuyReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getComponentDefectReasonGroup() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ComponentDefectReasonGroup?$select=ComponentDefectReasonGroupId,ComponentDefectReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getQtyAjustReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/QtyAdjustReasonGroup?$select=QtyAdjustReasonGroupId,QtyAdjustReasonGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getUnitLevelList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UnitLevel?$select=UnitLevelId,UnitLevel1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getOperationById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Operation?$filter=OperationId eq ${id}&$expand=BusinessUnit,LossReasonGroup,DefectReasonGoup,GainReasonGroup,BuyReasonGroup,ReworkReasonGroup,ComponentDefectCodeGrp,QtyAdjustReasonGroup,SellReasonGroup,PrintQueue,SecondAuthentication,InventoryLocation,UnitLevel,EquipmentGroup,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUOMList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Uom?$select=Uomid`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getPrintQueue() {
  const accessToken = getSessionToken();
  return api.get(`/odata/PrintQueue?$select=PrintQueueId,PrintQueueName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getQtyEquipmentGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentGroup?$select=EquipmentGroupId,EquipmentGroupName,Description`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
