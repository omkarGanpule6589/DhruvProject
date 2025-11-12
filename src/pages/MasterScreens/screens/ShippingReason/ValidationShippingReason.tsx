import * as Yup from "yup";

export const validation = Yup.object({
  ShippingReasonName: Yup.string().trim().required(" Shipping Reason Name  is required"),
});
