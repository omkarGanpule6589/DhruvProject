import * as Yup from "yup";

export const validation = Yup.object({
  UnitDefectReasonName: Yup.string().required("Enter unit defect reason"),
  Description: Yup.string(),
});
