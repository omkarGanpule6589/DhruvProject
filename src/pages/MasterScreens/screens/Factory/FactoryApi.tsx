import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getFactoryList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Factory?$select=FactoryId,FactoryName,FactoryDescription,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getFactoryById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Factory?$filter=FactoryId eq ${id}&$expand=EquipmentStatusModel,PrintQueue,SecondAuthentication,TrainingReqGroup,NumberingRule,Calender,LastModifiedUser&$expand=FactoryLocationDetails($filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editFactory(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Factory?key=${id}`, reqObj,
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

export function getPrintQueueNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/PrintQueue?$select=PrintQueueId,PrintQueueName`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSecondAuthenticationNames() {
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

export function getNumberingRuleNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/NumberingRule?$select=NumberingRuleId,NumberingRuleName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function createFactory(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Factory`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getCalendarNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Calendar?$select=CalendarId,CalendarName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}