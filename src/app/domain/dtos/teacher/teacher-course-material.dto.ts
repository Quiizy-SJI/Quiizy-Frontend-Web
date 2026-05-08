export type MaterialType =
  | 'LECTURE_NOTES'
  | 'TIMETABLE'
  | 'ASSIGNMENT'
  | 'REFERENCE'
  | 'SYLLABUS'
  | 'OTHER';

export interface TeacherCourseMaterialDto {
  id: string;
  courseId: string;
  teacherId: string;
  title: string;
  description?: string | null;
  materialType: MaterialType;
  fileName: string;
  fileSize: number;
  ragMaterialId: string;
  isIndexed: boolean;
  indexError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadTeacherCourseMaterialDto {
  file: File;
  title?: string;
  description?: string;
  materialType?: MaterialType;
}

export interface UploadTeacherCourseMaterialResponseDto {
  material: TeacherCourseMaterialDto;
  warning?: string;
}
