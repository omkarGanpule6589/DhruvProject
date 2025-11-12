import * as Yup from "yup";

export const validation = Yup.object({
  FutureHoldSetupName: Yup.string()
    .min(2)
    .required("Enter  FutureHoldDetails Name"),
});
