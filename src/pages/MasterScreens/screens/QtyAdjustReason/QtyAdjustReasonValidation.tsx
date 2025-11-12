import * as Yup from "yup";

export const validation = Yup.object({
  QtyAdjustReasonName: Yup.string().trim().required("Qty Adjust Reason Name is required"),
});
