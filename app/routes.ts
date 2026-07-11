import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // Lecturer Routes
  ...prefix("lecturer", [
    index("routes/lecturer.dashboard.tsx"),
    route("courses", "routes/lecturer.courses.tsx"),
    route("courses/new", "routes/lecturer.course.new.tsx"),
    route("courses/:courseId", "routes/lecturer.course.tsx"),
    route("courses/:courseId/assignments/new", "routes/lecturer.assignment.new.tsx"),
    route("assignments/:assignmentId", "routes/lecturer.assignment.tsx"),
    route("notifications", "routes/lecturer.notifications.tsx"),
    route("help", "routes/lecturer.help.tsx")
  ]),

  // Student Routes
  ...prefix("student", [
    index("routes/student.dashboard.tsx"),
    route("assignments", "routes/student.assignments.tsx"),
    route("messages", "routes/student.messages.tsx"),
    route("notifications", "routes/student.notifications.tsx"),
    route("settings", "routes/student.settings.tsx"),
    route("appeals", "routes/student.appeals.tsx"),
    route("assignments/:assignmentId", "routes/student.assignment.tsx"),
    route("assignments/:assignmentId/appeal", "routes/student.appeal.tsx"),
    route("courses", "routes/student.courses.tsx"),
    route("courses/:courseId", "routes/student.course.tsx"),
    route("help", "routes/student.help.tsx")
  ])
] satisfies RouteConfig;
 
