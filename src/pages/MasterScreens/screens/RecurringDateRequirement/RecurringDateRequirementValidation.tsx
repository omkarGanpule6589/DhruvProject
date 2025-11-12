import * as Yup from "yup";

export const validation = Yup.object({
  RecurringDateRequirement1: Yup.string().trim().required("Recurring Date Requirement  Name is required"),
  Revision: Yup.string().trim().required("Revision is required"),
  Frequency: Yup.string().trim().required("Frequency is required"),
  MaintenanceReasonId: Yup.string().trim().required("Maintenance Reason is required"),
  RecurringDatePattern: Yup.string().trim().required("Recurring Date Pattern  is required"),
});
