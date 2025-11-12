import * as Yup from "yup";

export const validation = Yup.object({
  UsageRequirement1: Yup.string()
    .trim()
    .required("Usage Requirement  Name is required"),
  MaxUsageCount: Yup.string().trim().required("Max Usage Count is required"),
  MaintenanceReasonId: Yup.string()
    .trim()
    .required("Maintenance Reason is required"),
  Revision: Yup.string().trim().required("Revision is required"),
});
