import * as Yup from "yup";

export const validation = Yup.object({
    PrintLabelDef: Yup.string().trim().required("Print Label Def  Name is required"),
LabelTemplate: Yup.string().trim().required("Label Template is required"),
});