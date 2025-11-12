import * as Yup from "yup";

export const validation = Yup.object({
  SellReasonName: Yup.string().trim().required("Sell Reason Name is required"),
});
