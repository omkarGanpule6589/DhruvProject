import * as Yup from "yup";

export const validation = Yup.object({
  WorkOrderName: Yup.string().min(2).max(25).required("Enter Work Order Name "),
});
