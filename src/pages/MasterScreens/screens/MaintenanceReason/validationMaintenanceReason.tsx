import * as Yup from "yup";

export const validation = Yup.object({
  MaintenanceReason1: Yup.string().trim().required("Maintenance Reason Name is required"),
  //Description: Yup.string()
});