import * as Yup from "yup";

export const validation = Yup.object({
  SampleTestName: Yup.string().trim().required("Sample Test Name is required"),
  SampleType: Yup.string().trim().required("Sample Type is required"),
  Revision: Yup.string().trim().required("Revision is required"),
});
