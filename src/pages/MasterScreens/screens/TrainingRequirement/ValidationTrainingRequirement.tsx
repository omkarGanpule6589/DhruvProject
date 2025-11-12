import * as Yup from "yup";

export const validation = Yup.object({
  TrainingRequirementName: Yup.string()
    .trim()
    .required(" Training Requirement Name is required"),
});
