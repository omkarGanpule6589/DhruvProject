import * as Yup from "yup";

export const validation = Yup.object({
    SecondAuthenticationCosignReason1: Yup.string().trim().required("Second Authentication  Cosign Reason Name is required"),
 });