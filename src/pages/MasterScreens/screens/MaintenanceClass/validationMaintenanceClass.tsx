import * as Yup from "yup";

export const validation = Yup.object({
  MaintenanceGroupName: Yup.string().trim().required("Maintenance Group Name is required"),
  //Description: Yup.string()
});