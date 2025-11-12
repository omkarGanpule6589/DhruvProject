import * as Yup from "yup";

export const validation = Yup.object({
    DepartmentName: Yup.string().trim().required("Department Name is required"),
});
