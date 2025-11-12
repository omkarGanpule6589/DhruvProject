import * as Yup from "yup";

export const validation = Yup.object({
    TaskListId: Yup.string()
    .matches(/^\d+$/, "Invalid TaskListId")
    .required("TaskListId is required"),
 });