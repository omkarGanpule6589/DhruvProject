import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEmailNotificationList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EmailNotification?$select=EmailNotificationId,EmailNotification1,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEmailNotificationdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EmailNotification?$filter=EmailNotificationId eq ${id}&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function CreateEmailNotification(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EmailNotification", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editEmailNotification(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EmailNotification?key=${id}`, params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
