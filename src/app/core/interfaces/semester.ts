export interface Semester {
  id: number;
  name: string;
  dateRange: string;
  status: 'Active' | 'Scheduled' | 'Completed';
  color: string;
}

export interface QuestionBank {
  id: string;
  name: string;
  status: 'Active' | 'Pending';
  questionsCount: number;
  notes?: string;
}

export interface ActivityAlert {
  type: 'info' | 'warning' | 'success';
  color: string;
  title: string;
  description: string;
  time?: string;
}
