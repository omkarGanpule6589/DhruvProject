import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCalenderList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Calendar?$select=CalendarId,CalendarName,CreatedDateTime&$expand=CreatedUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getCalendarDetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Calendar?$filter=CalendarId eq ${id}&$expand=LastModifiedUser,CalendarShifts($expand=shift;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditCalendaretails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Calendar?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateCalendar(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/Calendar", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getshiftList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Shift?$select=ShiftId,ShiftName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
