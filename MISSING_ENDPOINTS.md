# CheckHit - Required Data Fetching Endpoints (GET)

This document specifies the missing read-only (`GET`) API endpoints required by the CheckHit frontend UI to support full dynamic data loading with TanStack Query.

---

## 1. Student Assignments & Submissions

### `GET /api/students/{studentId}/courses/{courseId}/assignments`
*(Alternative: `GET /api/students/{studentId}/assignments?courseId={courseId}`)*
* **Frontend Screen**: `app/routes/student.course.tsx` & `app/routes/student.assignments.tsx`
* **Description**: Returns all assignments for the course enriched with the specific student's submission status and grade.
* **Path Parameters**:
  * `studentId` (`uuid`, required): The student's ID.
  * `courseId` (`uuid`, required): The course ID.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "id": "822b480c-3a90-43a4-b4eb-75c05ee82d83",
      "courseId": "9ac59487-edce-4306-b2d4-6f8c75c65cf6",
      "name": "Lab 1: Linked Lists & Stack Implementations",
      "type": "Coding",
      "maxScore": 100,
      "startAt": "2026-07-23T13:54:47.540Z",
      "dueAt": "2026-08-07T13:54:47.540Z",
      "submission": {
        "id": "sub-3a936078-...",
        "status": "CHECKED",
        "grade": 95,
        "submittedAt": "2026-08-01T10:30:00.000Z"
      }
    }
  ]
  ```
  *Note on `submission.status`*: `NOT_SUBMITTED` (`pending`), `EVALUATING` (`checking`), `CHECKED` (`checked`), or `IN_APPEAL` (`appeal`). When not submitted, `submission` can be `null`.

---

### `GET /api/assignments/{assignmentId}/submissions?studentId={studentId}`
*(Alternative: `GET /api/submissions/{submissionId}`)*
* **Frontend Screen**: `app/routes/student.assignment.tsx` (`StudentAssignmentDetail.tsx`)
* **Description**: Retrieves the full submission details for a student, including automated test results, criteria breakdown, and AI evaluation report.
* **Suggested Response Format (`200 OK`)**:
  ```json
  {
    "id": "sub-uuid-1",
    "assignmentId": "822b480c-3a90-43a4-b4eb-75c05ee82d83",
    "studentId": "3a12e3cb-3b43-4461-b514-5404d55e3479",
    "status": "CHECKED",
    "grade": 92,
    "submittedAt": "2026-08-01T12:00:00.000Z",
    "files": [
      {
        "id": "file-1",
        "name": "solution.py",
        "size": "4.2 KB",
        "downloadUrl": "/api/files/download/..."
      }
    ],
    "evaluation": {
      "overallFeedback": "Excellent implementation of memory safety and boundary checking.",
      "scoreBreakdown": [
        { "criterion": "Correctness & Automated Tests", "score": 48, "maxScore": 50 },
        { "criterion": "Code Style & Readability", "score": 25, "maxScore": 25 },
        { "criterion": "Time & Space Complexity", "score": 19, "maxScore": 25 }
      ],
      "strengths": ["Clear recursive base cases", "Robust null checking"],
      "improvements": ["Consider iterative stack to prevent deep recursion overflow"]
    }
  }
  ```

---

## 2. Lecturer Assignment Submissions

### `GET /api/assignments/{assignmentId}/submissions`
* **Frontend Screen**: `app/routes/lecturer.assignment.tsx`
* **Description**: Returns all enrolled students and their submission status for a specific assignment.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "submissionId": "sub-uuid-1",
      "student": {
        "id": "3a12e3cb-3b43-4461-b514-5404d55e3479",
        "name": "Yossi Cohen",
        "email": "yossi.cohen@university.edu"
      },
      "status": "CHECKED",
      "grade": 95,
      "submittedAt": "2026-08-01T10:30:00.000Z",
      "hasAppeal": false
    }
  ]
  ```

---

## 3. Appeals

### `GET /api/students/{studentId}/appeals`
* **Frontend Screen**: `app/routes/student.appeals.tsx`
* **Description**: Returns all grade appeals submitted by the logged-in student.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "id": "appeal-uuid-1",
      "assignmentId": "822b480c-3a90-43a4-b4eb-75c05ee82d83",
      "assignmentName": "Lab 1: Linked Lists",
      "courseName": "CS201: Data Structures and Algorithms",
      "category": "Code Misunderstanding",
      "rationale": "The test case assumes 0-indexed nodes while spec mentioned 1-indexed.",
      "status": "PENDING",
      "originalGrade": 80,
      "updatedGrade": null,
      "createdAt": "2026-08-02T14:00:00.000Z"
    }
  ]
  ```

---

### `GET /api/lecturers/{lecturerId}/appeals`
*(Query Params: `?status=PENDING|RESOLVED&courseId=...`)*
* **Frontend Screen**: `app/routes/lecturer.appeals.tsx`
* **Description**: Returns all appeals submitted across courses taught by the lecturer.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "id": "appeal-uuid-1",
      "student": {
        "id": "3a12e3cb-3b43-4461-b514-5404d55e3479",
        "name": "Yossi Cohen"
      },
      "assignmentName": "Assignment 2: Balanced BST",
      "courseName": "CS201: Data Structures",
      "category": "Grading Error",
      "status": "PENDING",
      "originalGrade": 78,
      "submittedAt": "2026-08-02T11:20:00.000Z"
    }
  ]
  ```

---

### `GET /api/appeals/{appealId}`
* **Frontend Screen**: `app/routes/lecturer.appeal.tsx` (Appeal Review page)
* **Description**: Full detail of a single appeal for lecturer review.
* **Suggested Response Format (`200 OK`)**:
  ```json
  {
    "id": "appeal-uuid-1",
    "student": {
      "id": "3a12e3cb-3b43-4461-b514-5404d55e3479",
      "name": "Yossi Cohen",
      "email": "yossi@university.edu"
    },
    "assignment": {
      "id": "97d63d84-...",
      "name": "Assignment 2: Balanced BST",
      "maxScore": 100
    },
    "originalGrade": 78,
    "category": "Grading Error",
    "studentRationale": "My rotation helper preserved height invariants, but the edge case was penalised twice.",
    "attachments": [
      { "name": "proof.pdf", "url": "/api/files/download/proof.pdf" }
    ],
    "originalAiFeedback": "Points deducted due to missing edge case for double-left rotation.",
    "status": "PENDING"
  }
  ```

---

## 4. Notifications

### `GET /api/users/{userId}/notifications`
* **Frontend Screen**: Top Navigation bar dropdown, `student.notifications.tsx`, `lecturer.notifications.tsx`
* **Description**: Returns system notifications for the authenticated user.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "id": "notif-uuid-1",
      "title": "Grade Published",
      "message": "Your grade for Assignment 2 has been published: 95/100",
      "link": "/student/assignments/97d63d84-...",
      "isRead": false,
      "createdAt": "2026-08-02T15:30:00.000Z"
    }
  ]
  ```

---

## 5. Course Materials / Resources *(Optional)*

### `GET /api/courses/{courseId}/resources`
* **Frontend Screen**: `app/routes/student.course.tsx` & `app/routes/lecturer.course.tsx`
* **Description**: Returns course files, syllabus, slides, and recordings.
* **Suggested Response Format (`200 OK`)**:
  ```json
  [
    {
      "id": "res-1",
      "title": "Lecture 4 Presentation - Trees",
      "type": "pdf",
      "size": "2.4 MB",
      "downloadUrl": "/api/courses/9ac59487-.../resources/res-1"
    }
  ]
  ```

---

## 6. Dashboard Metrics *(Optional - Can also be aggregated on client)*

### `GET /api/students/{studentId}/dashboard`
* **Frontend Screen**: `app/routes/student.dashboard.tsx`
* **Description**: Returns overview metrics: upcoming assignments with deadlines, recent grades, and active appeals count.

### `GET /api/lecturers/{lecturerId}/dashboard`
* **Frontend Screen**: `app/routes/lecturer.dashboard.tsx`
* **Description**: Returns overview metrics: active courses, pending appeals count, assignments awaiting review.
