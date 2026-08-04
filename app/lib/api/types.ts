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

export type MessageTargetType = 'DIRECT' | 'BROADCAST' | 'SYSTEM' | 'ALL';
export type MessageFolder = 'inbox' | 'sent' | 'archive';

export interface MessageSender {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface MessageReply {
  id: string;
  messageId: string;
  senderId: string;
  sender: MessageSender;
  content: string;
  isMe?: boolean;
  createdAt: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  sender: MessageSender;
  targetType: 'DIRECT' | 'BROADCAST' | 'SYSTEM';
  courseId?: string | null;
  courseCode?: string | null;
  courseName?: string | null;
  subject: string;
  snippet: string;
  content: string;
  isPriority: boolean;
  isRead: boolean;
  readAt?: string | null;
  isArchived?: boolean;
  isSentByMe?: boolean;
  recipientCount?: number;
  readCount?: number;
  repliesCount?: number;
  recipient?: MessageSender;
  replies?: MessageReply[];
  createdAt: string;
  updatedAt: string;
}

export interface GetMessagesParams {
  userId?: string;
  folder?: MessageFolder;
  targetType?: MessageTargetType;
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MessagesListResponse {
  messages: MessageItem[];
  total: number;
  unreadCount: number;
  page?: number;
  limit?: number;
}

export interface CreateMessageDto {
  senderId?: string;
  targetType: 'DIRECT' | 'BROADCAST' | 'SYSTEM';
  courseId?: string;
  recipientId?: string;
  subject: string;
  content: string;
  isPriority?: boolean;
}

export interface CreateReplyDto {
  senderId?: string;
  content: string;
}

export interface UnreadMessagesCountResponse {
  unreadCount: number;
}

export interface GetStudentAssignmentsParams {
  limit?: number;
  status?: string;
  upcoming?: boolean;
  sort?: string;
}

export interface GetStudentCoursesParams {
  limit?: number;
  sortBy?: 'urgency' | 'name' | 'recent' | string;
}

export interface UrgentCourse extends Course {
  openAssignmentsCount?: number;
  nextDueAt?: string | null;
}

export interface GetStudentAppealsParams {
  limit?: number;
  status?: string;
}

export type StudentAssignmentStatus =
  | 'NOT_STARTED'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'GRADED'
  | 'OVERDUE';

export type EvaluationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type AppealStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export interface AssignmentCourse {
  id: string;
  name: string;
  semester: string;
  academicYear: number;
}

export interface SubmissionFile {
  id: string;
  name?: string;
  filename?: string;
  sizeBytes?: number;
  fileSize?: number;
  mimeType?: string;
  downloadUrl?: string;
  fileUrl?: string;
}

export interface AssignmentEvaluation {
  id: string;
  score: number | null;
  maxScore: number;
  feedback: string | null;
  status: EvaluationStatus;
  isFinal: boolean;
  evaluatedAt: string | null;
}

export interface AssignmentSubmission {
  id: string;
  attemptNumber: number;
  status: 'DRAFT' | 'SUBMITTED';
  submittedAt: string | null;
  files: SubmissionFile[];
  evaluation: AssignmentEvaluation | null;
}

export interface AssignmentAppeal {
  id: string;
  status: AppealStatus;
  reason: string;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface StudentAssignmentDetailResponse {
  id: string;
  courseId: string;
  name: string;
  description: string;
  type: string;
  evaluationInstructions: string;
  maxScore: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  startAt: string | null;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
  course: AssignmentCourse;
  studentStatus: StudentAssignmentStatus;
  submission: AssignmentSubmission | null;
  appeal: AssignmentAppeal | null;
}

export interface LecturerAppealStudent {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LecturerAppealSubmissionAssignment {
  id: string;
  name: string;
  maxScore: number;
  courseId: string;
  course: {
    id: string;
    name: string;
    semester: string;
    academicYear: number;
  };
}

export interface LecturerAppealSubmission {
  id: string;
  attemptNumber: number;
  status: string;
  submittedAt: string;
  assignment: LecturerAppealSubmissionAssignment;
}

export interface LecturerAppealReviewer {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LecturerAppeal {
  id: string;
  submissionId: string;
  evaluationId: string;
  studentId: string;
  reviewerId?: string | null;
  reason: string;
  status: AppealStatus | BackendAppealStatus;
  resolution?: string | null;
  resolvedAt?: string | null;
  createdAt?: string;
  student: LecturerAppealStudent;
  submission: LecturerAppealSubmission;
  evaluation: AssignmentEvaluation;
  reviewer?: LecturerAppealReviewer | null;
  files?: SubmissionFile[];
}

export interface LecturerAppealsStats {
  pendingCount: number;
  resolvedCount: number;
  totalCount: number;
}

export interface GetLecturerAppealsParams {
  status?: string;
  courseId?: string;
  search?: string;
  limit?: number;
}

export interface ResolveAppealDto {
  status: 'ACCEPTED' | 'REJECTED' | 'UNDER_REVIEW' | 'SUBMITTED' | string;
  resolution: string;
  reviewerId?: string;
  newScore?: number;
}

export interface LecturerDashboardKPIs {
  activeCourses: number;
  pendingAppeals: number;
  readyToPublish: number;
  averageScore: number;
}

export interface RequiresAttentionItem {
  id: string;
  type: 'appeal' | 'ai-grading' | 'deadline' | string;
  title: string;
  subtitle: string;
  actionText: string;
  actionHref: string;
  accentColor: 'rose' | 'teal' | 'amber' | 'indigo' | string;
}

export interface GradeDistributionBucket {
  rangeKey: string;
  label: string;
  count: number;
  color?: string;
  darkColor?: string;
}

export interface CourseGradeStats {
  courseId: string;
  code?: string;
  courseName: string;
  average: number;
  median: number;
  passRate: number;
  totalStudents: number;
  data: GradeDistributionBucket[];
}

export interface LecturerGradeDistribution {
  all: CourseGradeStats;
  byCourse: CourseGradeStats[];
}

export interface AssignmentCompletionItem {
  assignmentId: string;
  name: string;
  code: string;
  graded: number;
  aiChecking: number;
  submitted: number;
  missing: number;
  total: number;
}

export interface LecturerDashboardRecentCourse {
  id: string;
  name: string;
  code: string;
  studentsCount: number;
  activeAssignments: number;
  academicYear: number;
  semester: string;
}

export interface LecturerDashboardData {
  kpis: LecturerDashboardKPIs;
  requiresAttention: RequiresAttentionItem[];
  gradeDistribution: LecturerGradeDistribution;
  assignmentCompletion: AssignmentCompletionItem[];
  recentCourses: LecturerDashboardRecentCourse[];
}

