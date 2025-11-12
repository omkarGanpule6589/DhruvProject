import * as Yup from "yup";

export const validation = Yup.object({
  DigiTaskName: Yup.string().trim().required("Digi Task Name is required"),
  ExecutionMode:Yup.string().required("Execution Mode is required"),
  Revision:Yup.string().required("Revision is required"),
});
