import type { Route } from "./+types/student.assignment";
import MainLayout from "../components/MainLayout";
import StudentAssignmentDetail from "../components/StudentAssignmentDetail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Portal | Check Hit" },
  ];
}

export default function StudentRoute() {
  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <StudentAssignmentDetail />
    </MainLayout>
  );
}
