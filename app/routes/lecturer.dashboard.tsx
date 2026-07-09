import type { Route } from "./+types/lecturer.dashboard";
import MainLayout from "../components/MainLayout";
import LecturerDashboard from "../components/LecturerDashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lecturer Portal | Check Hit" },
  ];
}

export default function LecturerRoute() {
  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <LecturerDashboard />
    </MainLayout>
  );
}
