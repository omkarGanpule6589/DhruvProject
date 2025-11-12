import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEmployeeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Employee?$select=EmployeeId,EmployeeName,FullName,Designation,EmailAddress,RoleId,FactoryId,EmployeeCode,CreatedDateTime&$expand=CreatedUser
`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editEmployee(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Employee?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createEmployee(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Employee`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEmployeeById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Employee?$filter=EmployeeId eq ${id}&$expand=Role,Factory,BusinessUnit,SecondAuthenticationRoleGroup,Operation,EmployeeOperationMappings($expand=ItemClass,ItemTypeCategory,Operation;$filter=IsDeleted ne true)&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getFactoryList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Factory?$select=FactoryId,FactoryName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getESigRoleGroup() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SecondAuthenticationRoleGroup?$select=SecondAuthenticationRoleGroupId ,SecondAuthenticationRoleGroup1`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoleIdList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Role?$select=RoleId,RoleName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Operation?$select=OperationId,OperationName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getBusinessUnitList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/BusinessUnit?$select=BusinessUnitId,BusinessUnitName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getItemClasses() {
  const accessToken = getSessionToken();
  return GKBapi.get(`OData/ItemClassMaster`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
       
    },
  });
}

export function getItemTypeByClass(ItemClassName) {
  const accessToken = getSessionToken();
  const encodedLensType = encodeURIComponent(ItemClassName);
  return GKBapi.get(
    `api/GetUniqueItemTypeCategory?ItemClassName=${encodedLensType}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        
      },
    }
  );
}