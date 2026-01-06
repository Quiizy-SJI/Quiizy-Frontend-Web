export interface TeachingUnit {
  code: string;
  name: string;
  department: string;
  credits: number;
  status: 'Ready' | 'Awaiting Specialty' | 'Needs Review';
}