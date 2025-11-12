import * as Yup from "yup";

export const validation = Yup.object({
    OperationName: Yup.string().trim().required("Operation Name is required"),


    UnitLevelId: Yup.string().trim().required("Unit Level is required"),
});
