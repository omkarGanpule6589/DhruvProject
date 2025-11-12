import * as Yup from "yup";

export const validation = Yup.object({
  DateRequirementName: Yup.string().trim().required(
    "Date Requirement Name is required"
  ),
  ScheduleDate: Yup.string().trim().required("Schedule Date is required"),
  MaintenanceReasonId: Yup.string().required(
    "Maintenance Reason is required"
  ),
  Revision: Yup.string().trim().required("Revision is required"),
});
