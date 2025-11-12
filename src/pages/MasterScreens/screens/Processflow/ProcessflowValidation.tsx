import * as Yup from "yup";

export const validation = Yup.object({
    ProcessflowName: Yup.string().trim().required("Process Flow Name is required"),
    ProcessflowRevision: Yup.string().trim().required("Revision is required"),
});