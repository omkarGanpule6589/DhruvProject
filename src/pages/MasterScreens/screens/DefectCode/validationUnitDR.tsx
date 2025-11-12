import * as Yup from "yup";

export const validation = Yup.object({
  DefectCodeName: Yup.string().trim().required("Defect Reason Name is required"),
 });
