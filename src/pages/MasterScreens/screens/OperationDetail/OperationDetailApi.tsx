import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getOperationDetailList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/OperationDetail?$select=OperationDetailId,OperationDetailName,Description,Revision,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getOperationDetailDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/OperationDetail?$filter=OperationDetailId eq ${id}&$expand=DataCollectionTxnMaps($expand=DataCollectionDef,txn;$filter=IsDeleted ne true)&$expand=LabelTxnMaps($expand=PrintLabelDef,Processflow,txn,Customer;$filter=IsDeleted ne true),Operation,DocumentGroup,TrainingReqGroup,DigiTask,Uom,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditOperationDetaildetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/OperationDetail?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateOperationDetailn(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/OperationDetail", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Operation?$select=OperationId,OperationName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getTrainingRequirementGroupNamesforOperationDetail() {
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
export function getDigiTaskforOperationDetail() {
  const accessToken = getSessionToken();
  return api.get(`/odata/DigiTask?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDataCollectionNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName,IsActive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getTXn() {
  const accessToken = getSessionToken();
  return api.get(`/odata/TransactionData?$select=Id,Name`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDocumentGroupNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DocumentGroup?$select=DocumentGroupId,DocumentGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getprintLabeldef() {
  const accessToken = getSessionToken();
  return api.get(`/odata/PrintLabelDef?$filter=State ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProcessFlowList1() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Processflow?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProcessFlowListwithid(id) {
  const accessToken = getSessionToken();

  return api.get(`/odata/Processflowstep?$filter=OperationDetailId eq ${id}and IsDeleted eq false&select=ProcessflowId&$expand=Processflow($filter=IsActive ne false)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}



export function getItCustomerMaster() {
  const accessToken = getSessionToken();
  return GKBapi.get(`OData/CustomerMaster`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
       
    },
  });
}