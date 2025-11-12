import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getShiftdetails() {
  const accessToken = getSessionToken();
  return api.get(`/odata/shift?$select=ShiftId,ShiftName,IsDeleted,CreatedDateTime&$expand=CreatedUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getShiftdetailsFetch(id) {
    const accessToken = getSessionToken();
    return api.get(`/odata/shift?$filter=ShiftId eq ${id}&$select=ShiftName,LastModifiedDateTime&$expand=LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
  }
  export function UpdateShift(id, params) {
    const accessToken = getSessionToken();
    return api.patch(`/odata/shift?key=${id}`, params,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  export function CreateShift( params) {
    const accessToken = getSessionToken();
    return api.post("/odata/Shift", params,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }