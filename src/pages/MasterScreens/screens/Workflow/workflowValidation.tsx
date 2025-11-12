import * as Yup from "yup";

export const validation = Yup.object({
    WorkflowName: Yup.string().required("Enter Workflow name"),
    WorkflowRevision:Yup.string(),
    ActiveRevision: Yup.string(),
    IsActive: Yup.string()
});