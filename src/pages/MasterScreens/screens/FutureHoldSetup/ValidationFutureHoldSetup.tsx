import * as Yup from "yup";

export const validation = Yup.object({
  OperationDetailId: Yup.string().required("Operation Detail is required"),
    HoldDays: Yup.string().required("Hold Days is required"),
    HoldReasonName: Yup.string().required("Hold Reason is required"),
   
  });
