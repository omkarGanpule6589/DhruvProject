import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSecondAuthList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthentication?$select=SecondAuthenticationId,SecondAuthentication1,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getSecondAuthDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthentication?$filter=SecondAuthenticationId eq ${id}&$expand=LastModifiedUser,SecondAuthenticationDetails($expand=CosignerRole,SecondAuthenticationMeaning,Role;$filter=IsDeleted ne true)`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editSecondAuth(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SecondAuthentication?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateSecondAuth(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SecondAuthentication", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoleList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/role?$select=RoleId,RoleName`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEsignMEaningList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SecondAuthenticationMeaning?$select=SecondAuthenticationMeaningId,SecondAuthenticationMeaning1`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
