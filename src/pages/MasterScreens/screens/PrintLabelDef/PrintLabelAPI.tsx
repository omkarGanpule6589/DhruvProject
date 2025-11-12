import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getPrintDefList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/PrintLabelDef?$select=PrintLabelDefId,PrintLabelDefName,Description,PrintLabelDefRevision,ActiveRevision,CreatedDateTime&$expand=CreatedUser` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getPrintDefById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/PrintLabelDef?$filter=PrintLabelDefId eq ${id}&$select=PrintLabelDefId,PrintLabelDefName,PrintLabelDefRevision,LabelTemplate,Description,BiginDelimeter,State,ActiveRevision,EndDelimeter,LastModifiedDateTime&$expand=PrintLabelTags,LastModifiedUser` ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editPrintLabelDef(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/PrintLabelDef?key=${id}`, reqObj ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createPrintLabelDef(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/PrintLabelDef`, reqObj ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body ,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getLabelTemplateNames() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/PrintLabelService/GetPrintTemplates`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
