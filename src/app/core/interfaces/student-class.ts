export interface StudentClass {
    name: string;
    level: string;
    department: string;
    studentsEnrolled: number;
    teachers: string[];
    subjects: string[];
    status: 'Active' | 'Inactive' | 'Completed';
}

export interface Student {
    matricule: string;
    name: string;
    surname: string;
    email: string;
    status: 'Enrolled' | 'Graduated' | 'Dropped';
    className: string;
    numCarryOver: number;
    

}