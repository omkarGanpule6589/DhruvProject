import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Equipment?$select=EquipmentId,EquipmentName,Description,BarcodeNo,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEquipmentById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/Equipment?$filter=EquipmentId eq ${id}&$expand=EquipmentFamily,EquipmentType,Factory,Location,Supplier,EquipmentStatusModel,TrainingReqGroup,DocumentGroup,MaintenanceGroup,LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editEquipment(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Equipment?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEquipmentFamilyNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentFamily?$select=EquipmentFamilyId,EquipmentFamilyName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEquipmentTypeNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/EquipmentType?$select=EquipmentTypeId,EquipmentType1`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getFactoryNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Factory?$select=FactoryId,FactoryName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getFactoryLocationNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/FactoryLocationDetail?$select=factoryLocationId,locationName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getSupplierNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Supplier?$select=SupplierId,Supplier1`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEquipmentStatusModelNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentStatusModel?$select=EquipmentStatusModelId,EquipmentStatusModelName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getTrainingRequirementGroupNames() {
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

export function getMaintenanceClassNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/MaintenanceGroup?$select=MaintenanceGroupId,MaintenanceGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function createEquipment(params) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Equipment`, params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
