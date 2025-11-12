import { api } from "../components/API/apiConfig";

const getSessionToken = () => {
  const tokenString = sessionStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
};

export function getModelMcc() {
  const accessToken = getSessionToken();

  return api.get(`odata/ModelMcc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getModelProjectType() {
  const accessToken = getSessionToken();

  return api.get(`odata/ModelProjectType`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getPipelineStatus() {
  const accessToken = getSessionToken();

  return api.get(`odata/PipelineStatus`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getHRRole() {
  const accessToken = getSessionToken();
  return api.get(`odata/HrRole`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getModelCountry() {
  const accessToken = getSessionToken();
  return api.get(`odata/ModelCountry`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getModelFinancialYear() {
  const accessToken = getSessionToken();
  return api.get(`odata/ModelFinancialYear`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOppPipelineResourceRequirements(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/OppPipelineDetail?$filter=Id
    eq ${id}&$expand=OppPipelineResourceRequirements`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
