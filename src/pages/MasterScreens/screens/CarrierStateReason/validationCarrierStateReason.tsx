import * as Yup from "yup";

export const validation = Yup.object({
  CarrierStateReasonName: Yup.string().trim().required("Carrier State Reason Name is required"),
 });