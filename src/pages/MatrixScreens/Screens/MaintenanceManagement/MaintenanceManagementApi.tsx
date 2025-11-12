

import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function BindEquipMaintStatusLists(params) {
    const accessToken = getSessionToken();
    return api.post("svc/EquipmentMaintenanceService/BindEquipMaintStatusLists", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  export function BindCheckLists(params) {
    const accessToken = getSessionToken();
    return api.post("svc/EquipmentMaintenanceService/BindCheckLists", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  export function MaintananceManagementPost(params) {
    const accessToken = getSessionToken();
    return api.post("svc/EquipmentMaintenanceService/EquipmentMaintManagement", params, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}