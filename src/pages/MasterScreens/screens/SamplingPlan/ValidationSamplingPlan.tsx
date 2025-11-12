import * as Yup from "yup";

export const validation = Yup.object({
  AqllevelName: Yup.string().trim().required("Aql Level Name is required"),
  InspectionLevelName: Yup.string().trim().required("Inspection Level Name is required"),
  Revision: Yup.string().required("Revision is required"),
});
