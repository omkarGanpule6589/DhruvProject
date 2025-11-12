import * as Yup from "yup";

export const validation = Yup.object({
  SampleDataPointName: Yup.string()
    .trim()
    .required(" Sample Data Point Name is required"),
  DataType: Yup.string().trim().required("Data Type is required"),
  Revision: Yup.string().trim().required("Revision is required"),
});
