import * as Yup from "yup";

export const validation = Yup.object({
  InspectionLevelName: Yup.string().trim().required("Inspection Level Name is required"),
});
