import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Check Hit | Grading AI" },
    { name: "description", content: "Check Hit AI grading platform" },
  ];
}

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans text-center">
      <div className="bg-white p-12 rounded-xl border border-gray-200 flex flex-col gap-6 w-full max-w-md items-center">
        <img src="/logo.png" alt="Check Hit Logo" className="h-10 object-contain mb-2" />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">ברוכים הבאים למערכת</h1>
        <Link to="/lecturer" className="w-full bg-[#00857e] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors">
          כניסה למרצים
        </Link>
        <Link to="/student" className="w-full bg-gray-50 border border-gray-200 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
          כניסה לסטודנטים
        </Link>
      </div>
    </div>
  );
}
