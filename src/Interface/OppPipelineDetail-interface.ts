export interface OppPipelineDetail {
  Id: number;
  OppPipelineId: number;
  HrRoleId: number;
  OppRoleDescription: string;
  CountryId: number;
  Billable: string;
  CreatedDate: string | null;
  CreatedBy: number | null;
  LastModifiedDate: string | null;
  LastModifiedBy: number | null;
}
