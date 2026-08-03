export type UserRole = 'STUDENT' | 'LECTURER';
export type LecturerPermission = 'OWNER' | 'EDITOR';
export type AssignmentStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type StudentTaskStatus = 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'GRADED' | 'OVERDUE' | 'APPEAL' | 'COMPLETED';
export type BackendAppealStatus = 'SUBMITTED' | 'IN_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'RESOLVED' | 'PENDING';
export type NotificationCategory = 'ASSIGNMENT' | 'GRADE' | 'APPEAL' | 'WARNING' | 'SYSTEM' | 'INFO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ltiSubject?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  userId: string;
  user: User;
}

export interface Lecturer {
  userId: string;
  user: User;
}

export interface CourseLecturer {
  courseId: string;
  lecturerId: string;
  lecturer?: Lecturer;
  permissionLevel: LecturerPermission;
  assignedAt: string;
}

export interface Course {
  id: string;
  name: string;
  semester: string;
  academicYear: number;
  ltiContextId?: string | null;
  lecturers?: CourseLecturer[];
  studentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluation {
  id: string;
  score: number;
  maxScore: number;
  feedback?: string | null;
  status: string;
  isFinal: boolean;
}

export interface Submission {
  id: string;
  attemptNumber: number;
  status: string;
  submittedAt: string;
  evaluation?: Evaluation | null;
  assignment?: (Assignment & { course?: Course }) | null;
}

export interface Assignment {
  id: string;
  courseId: string;
  name: string;
  description: string;
  type: string;
  evaluationInstructions: string;
  maxScore: number;
  status: AssignmentStatus;
  startAt?: string | null;
  dueAt?: string | null;
  ltiResourceLinkId?: string | null;
  ltiLineItemUrl?: string | null;
  course?: Course | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAssignment extends Assignment {
  studentStatus: StudentTaskStatus;
  submission?: Submission | null;
}

export interface AppealFileItem {
  appealId: string;
  fileId: string;
  file?: {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    s3Key?: string;
  };
}

export interface Appeal {
  id: string;
  submissionId: string;
  evaluationId?: string | null;
  studentId: string;
  reviewerId?: string | null;
  reason: string;
  status: BackendAppealStatus;
  resolution?: string | null;
  resolvedAt?: string | null;
  submission?: Submission | null;
  evaluation?: Evaluation | null;
  reviewer?: {
    userId: string;
    user?: User;
  } | null;
  files?: AppealFileItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  link?: string | null;
  metadata?: Record<string, any>;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
