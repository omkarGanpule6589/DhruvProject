import * as Yup from "yup";

export const validation = Yup.object({
  ProductName: Yup.string().trim().required("Product  Name is required"),
  ProductTypeId: Yup.string().trim().required("Product Type is required"),
// DefaultStartReasonId: Yup.string().trim().required("Default Start Reason is required"),
  ProductRevision: Yup.string().trim().required("Revision is required"),
 // DefaultStartDepartmentId: Yup.string().trim().required("Default Start Department is required"),
 // NumberingRuleId: Yup.string().trim().required("Numbering Rule is required"),
 // ProcessflowId: Yup.string().trim().required("Process flow is required"),


});
