import * as Yup from "yup";

export const validation = Yup.object({
    WorkInstructionName: Yup.string().trim().required("Work Instruction Name is required"),
});
