import * as Yup from "yup";

export const validation = Yup.object({
  ActionListName: Yup.string().trim().required("Action List Name is required"),
  ActionListRevision: Yup.string().trim().required("Revision is required"),
  ExecutionMode: Yup.string().trim().required("Execution Mode is required"),
});
