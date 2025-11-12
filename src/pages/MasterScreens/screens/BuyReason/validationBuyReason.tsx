import * as Yup from "yup";

export const validation = Yup.object({
  BuyReasonName: Yup.string().trim().required("Buy Reason Name is required"),
});
