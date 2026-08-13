# CheckHit Backend API Specification: Messaging & Broadcast System

> **Target Audience**: Backend Engineers / Server AI Agents  
> **Feature**: Student & Lecturer Messaging, Course Announcements & Threaded Discussions  
> **Frontend Consumers**: `app/routes/student.messages.tsx`, `app/routes/lecturer.messages.tsx`, Navigation Unread Badges

---

## 1. Architecture & Core Requirements

The frontend UI supports three core messaging paradigms:
1. **1:1 Direct Messages**: A student messaging a lecturer, or a lecturer messaging an individual student.
2. **1:N Course Broadcasts (Announcements)**: A lecturer sending a message to **all enrolled students** in a specific course.
3. **Threaded Replies**: Both parties can reply within a message thread.

### Key UX Capabilities Needed:
- **Per-User Read Tracking**: In course broadcasts (e.g. 1 lecturer to 80 students), each student tracks their own `isRead` state. The lecturer can see overall stats (`readCount` / `recipientCount`).
- **Archive & Soft Delete**: Students and lecturers can independently archive or delete messages from their inbox.
- **Search & Filters**: Filter by `all`, `broadcast`, `direct`, `sent`, `courseId`, and search by keywords.
- **Priority Flag**: Support `isPriority: boolean` for urgent announcements.

---

## 2. Recommended Database Schema (Prisma / SQL)

```prisma
enum MessageTargetType {
  DIRECT
  BROADCAST
  SYSTEM
}

enum PriorityLevel {
  NORMAL
  HIGH
  URGENT
}

model Message {
  id               String            @id @default(uuid())
  senderId         String
  sender           User              @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  
  courseId         String?
  course           Course?           @relation(fields: [courseId], references: [id], onDelete: SetNull)
  
  targetType       MessageTargetType @default(DIRECT)
  subject          String
  content          String            @db.Text
  isPriority       Boolean           @default(false)
  
  // Parent message for threading (optional)
  parentMessageId  String?
  parentMessage    Message?          @relation("MessageReplies", fields: [parentMessageId], references: [id], onDelete: Cascade)
  replies          Message[]         @relation("MessageReplies")
  
  // Recipients join table (crucial for per-user read/archive/delete tracking)
  recipients       MessageRecipient[]
  
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  @@index([senderId])
  @@index([courseId])
  @@index([createdAt])
}

model MessageRecipient {
  id           String    @id @default(uuid())
  messageId    String
  message      Message   @relation(fields: [messageId], references: [id], onDelete: Cascade)
  
  recipientId  String
  recipient    User      @relation("ReceivedMessages", fields: [recipientId], references: [id], onDelete: Cascade)
  
  isRead       Boolean   @default(false)
  readAt       DateTime?
  isArchived   Boolean   @default(false)
  isDeleted    Boolean   @default(false) // Soft delete for this recipient
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([messageId, recipientId])
  @@index([recipientId, isRead])
  @@index([recipientId, isArchived])
}
```

---

## 3. REST API Endpoints Specification

### Summary Table

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages` | List user messages (inbox/sent/archive) | Yes (User/Lecturer/Student) |
| `GET` | `/api/messages/:id` | Get message detail with full replies thread | Yes |
| `POST`| `/api/messages` | Send a new direct message or course broadcast | Yes |
| `POST`| `/api/messages/:id/replies` | Post a reply to an existing message thread | Yes |
| `PATCH`| `/api/messages/:id/read` | Mark message as read/unread | Yes |
| `PATCH`| `/api/messages/:id/archive` | Archive or unarchive a message | Yes |
| `DELETE`| `/api/messages/:id` | Delete (soft delete) message for user | Yes |
| `GET` | `/api/messages/unread-count` | Quick unread count for navbar badge | Yes |

---

### Endpoint 1: `GET /api/messages`
Returns the list of messages for the authenticated user.

* **Query Parameters**:
  * `folder` (`string`, optional): `'inbox'` (default), `'sent'`, `'archive'`
  * `targetType` (`string`, optional): `'DIRECT'`, `'BROADCAST'`, `'ALL'` (default: `'ALL'`)
  * `courseId` (`string`, optional): Filter messages related to a specific course.
  * `search` (`string`, optional): Query matching `subject`, `content`, sender name, or course name.
  * `page` (`number`, default `1`): Pagination page.
  * `limit` (`number`, default `20`): Page size.

* **Response (`200 OK`)**:
```json
{
  "messages": [
    {
      "id": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
      "senderId": "usr-lecturer-1",
      "sender": {
        "id": "usr-lecturer-1",
        "name": "ד\"ר דן פלג",
        "email": "dan@hit.ac.il",
        "role": "LECTURER",
        "avatarUrl": "https://i.pravatar.cc/150?img=11"
      },
      "targetType": "BROADCAST",
      "courseId": "crs-cs101",
      "courseCode": "CS101",
      "courseName": "מבוא למדעי המחשב",
      "subject": "הבהרה חשובה ודחיית מועד הגשה למטלה 3",
      "snippet": "סטודנטים יקרים, בעקבות שאלות רבות שעלו בתרגול...",
      "content": "סטודנטים יקרים,\n\nבעקבות שאלות רבות שעלו בתרגול בנוגע לחלק ב' במטלה 3...",
      "isPriority": true,
      "isRead": true,
      "readAt": "2026-08-03T12:30:00.000Z",
      "isArchived": false,
      "isSentByMe": false,
      "recipientCount": 84,
      "readCount": 76,
      "repliesCount": 2,
      "createdAt": "2026-08-03T10:15:00.000Z"
    }
  ],
  "total": 1,
  "unreadCount": 0
}
```

---

### Endpoint 2: `GET /api/messages/:id`
Retrieves a message and its complete chronological conversation thread.

* **Path Parameters**:
  * `id` (`string`, required): The message ID.

* **Response (`200 OK`)**:
```json
{
  "id": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
  "senderId": "usr-lecturer-1",
  "sender": {
    "id": "usr-lecturer-1",
    "name": "ד\"ר דן פלג",
    "email": "dan@hit.ac.il",
    "role": "LECTURER",
    "avatarUrl": "https://i.pravatar.cc/150?img=11"
  },
  "targetType": "BROADCAST",
  "courseId": "crs-cs101",
  "courseCode": "CS101",
  "courseName": "מבוא למדעי המחשב",
  "subject": "הבהרה חשובה ודחיית מועד הגשה למטלה 3",
  "content": "סטודנטים יקרים,\n\nבעקבות שאלות רבות שעלו בתרגול בנוגע לחלק ב' במטלה 3 (עצי חיפוש בינאריים), עודכן קובץ ההנחיות בפורטל הקורס עם דוגמאות הרצה נוספות.\n\nמועד ההגשה הסופי נדחה ב-48 שעות ליום חמישי 7 באוגוסט בשעה 23:59.\n\nבברכה,\nד\"ר דן פלג",
  "isPriority": true,
  "isRead": true,
  "recipientCount": 84,
  "readCount": 76,
  "createdAt": "2026-08-03T10:15:00.000Z",
  "replies": [
    {
      "id": "rep-987654",
      "messageId": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
      "senderId": "usr-student-22",
      "sender": {
        "id": "usr-student-22",
        "name": "יוסי כהן",
        "email": "yossi@hit.ac.il",
        "role": "STUDENT",
        "avatarUrl": "https://i.pravatar.cc/150?img=33"
      },
      "content": "תודה רבה על העדכון והדחייה! האם הדוגמאות כוללות גם מקרי קצה של עץ ריק?",
      "createdAt": "2026-08-03T11:00:00.000Z"
    },
    {
      "id": "rep-987655",
      "messageId": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
      "senderId": "usr-lecturer-1",
      "sender": {
        "id": "usr-lecturer-1",
        "name": "ד\"ר דן פלג",
        "email": "dan@hit.ac.il",
        "role": "LECTURER",
        "avatarUrl": "https://i.pravatar.cc/150?img=11"
      },
      "content": "כן, דוגמה מספר 4 בקובץ המעודכן מתייחסת בדיוק למקרה זה.",
      "createdAt": "2026-08-03T11:20:00.000Z"
    }
  ]
}
```

---

### Endpoint 3: `POST /api/messages`
Creates and dispatches a new message.

* **Case A: Course Broadcast (Lecturer to all course students)**
  * **Request Body**:
    ```json
    {
      "targetType": "BROADCAST",
      "courseId": "crs-cs101",
      "subject": "עדכון לגבי מועד בוחן אמצע",
      "content": "סטודנטים יקרים, הבוחן יתקיים ביום רביעי בשעה 10:00 בחדר 204.",
      "isPriority": true
    }
    ```
  * **Server Action**: Server resolves all students enrolled in `courseId` and generates corresponding `MessageRecipient` records.

* **Case B: Direct Message (Lecturer <-> Student)**
  * **Request Body**:
    ```json
    {
      "targetType": "DIRECT",
      "recipientId": "usr-student-22",
      "courseId": "crs-cs101", // optional but recommended for context
      "subject": "הערה לגבי הגשת מטלה 2",
      "content": "שלום יוסי, בדקתי את הפתרון שלך...",
      "isPriority": false
    }
    ```

* **Response (`201 Created`)**: Returns the created `Message` object.

---

### Endpoint 4: `POST /api/messages/:id/replies`
Adds a response to an existing message thread.

* **Path Parameters**:
  * `id` (`string`, required): Parent message ID.
* **Request Body**:
  ```json
  {
    "content": "שלום ד\"ר פלג, תודה רבה על המענה המהיר!"
  }
  ```
* **Response (`201 Created`)**:
  ```json
  {
    "id": "rep-987656",
    "messageId": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
    "senderId": "usr-student-22",
    "sender": {
      "id": "usr-student-22",
      "name": "יוסי כהן",
      "role": "STUDENT"
    },
    "content": "שלום ד\"ר פלג, תודה רבה על המענה המהיר!",
    "createdAt": "2026-08-04T11:45:00.000Z"
  }
  ```

---

### Endpoint 5: `PATCH /api/messages/:id/read`
Updates read status for the current authenticated user on this message.

* **Request Body**:
  ```json
  {
    "isRead": true
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "messageId": "c1f7b0a1-63bc-42aa-b883-9b8123456789",
    "isRead": true,
    "readAt": "2026-08-04T11:45:00.000Z"
  }
  ```

---

### Endpoint 6: `PATCH /api/messages/:id/archive`
Toggles whether this message is in the user's archive folder.

* **Request Body**:
  ```json
  {
    "isArchived": true
  }
  ```
* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "isArchived": true
  }
  ```

---

### Endpoint 7: `DELETE /api/messages/:id`
Soft deletes the message for the requesting user (sets `isDeleted = true` on their `MessageRecipient` row or sender record).

* **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Message removed from inbox"
  }
  ```

---

### Endpoint 8: `GET /api/messages/unread-count`
Lightweight query returning total unread messages count for badge displays in navigation.

* **Response (`200 OK`)**:
  ```json
  {
    "unreadCount": 3
  }
  ```

---

## 4. Frontend Integration Plan

Once backend endpoints are ready, the frontend will integrate via:
1. **API Service**: `app/lib/api/messages.ts` (using existing `apiClient`).
2. **React Query Hooks**: `app/hooks/useMessages.ts` (`useMessages`, `useMessageDetail`, `useSendMessage`, `useReplyMessage`, `useMarkMessageAsRead`).
3. **UI Hookup**: Replace `MOCK_MESSAGES_DATA` and `INITIAL_MESSAGES` in:
   - [student.messages.tsx](file:///c:/Users/lenovo-pc/Desktop/ai_project_ui/checkhit-ui/app/routes/student.messages.tsx)
   - [lecturer.messages.tsx](file:///c:/Users/lenovo-pc/Desktop/ai_project_ui/checkhit-ui/app/routes/lecturer.messages.tsx)
