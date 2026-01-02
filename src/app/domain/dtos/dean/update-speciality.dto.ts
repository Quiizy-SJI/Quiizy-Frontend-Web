export interface UpdateSpecialityDto {
  name?: string;
}

export class AssignHeadDto {
  // headId can be null to unassign
  headId?: string | null;
}
