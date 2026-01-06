export interface ExamType {
  type: string;
  weight: string;
  anonymous: boolean;
  autoPublish: boolean;
  status: 'Active' | 'Draft';
}

export interface MiniAdmin {
  name: string;
  department: string;
  classes: number;
  students: number;
  status: 'ACTIVE' | 'PENDING' | 'INVITE';
  access?: {
    department: string;
    info: string;
  };
  permissions?: string[];
}

export interface Distribution{
    label: string,
    percentage: number,
    color: string
}