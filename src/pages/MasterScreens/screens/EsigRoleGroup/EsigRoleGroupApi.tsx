import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEsigRoleGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthenticationRoleGroup?$select=SecondAuthenticationRoleGroupId,SecondAuthenticationRoleGroup1,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getEsigRoleGroupDetails(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SecondAuthenticationRoleGroup?$filter=SecondAuthenticationRoleGroupId eq ${id}&$expand=LastModifiedUser,SecondAuthenticationRoleGroupEntries($expand=Role;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editEsigRoleGroup(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SecondAuthenticationRoleGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateEsigRoleGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SecondAuthenticationRoleGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoleList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Role?$select=RoleId,RoleName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


