import * as Yup from "yup";

export const validation = Yup.object({
  ReworkReasonName: Yup.string().trim().required("Rework  Reason  Name is required"),
});
