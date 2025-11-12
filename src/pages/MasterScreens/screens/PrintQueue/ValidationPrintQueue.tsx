import * as Yup from "yup";

export const validation = Yup.object({
    PrintQueueName: Yup.string().trim().required("Print Queue Name is required"),
    PrintQueuePath: Yup.string().trim().required("Print Queue Path is required"),
});
