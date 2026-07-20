import type { Route } from "./+types/lecturer.course.new";
import MainLayout from "../components/MainLayout";
import { ChevronRight, Save, X, BookOpen, GraduationCap, Calendar, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button, LinkButton } from '../components/ui/Button';
import { Input, Textarea, Select, Label } from '../components/ui/Input';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create New Course | Check Hit" },
  ];
}

export default function NewCourseRoute() {
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally we'd save to API, then redirect
    navigate('/lecturer/courses');
  };

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/lecturer/courses" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
            <ChevronRight size={18} /> חזרה לקורסים
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">יצירת קורס חדש</h1>
          <p className="text-gray-500 mt-2 text-lg">הזן את פרטי הקורס החדש שברצונך לפתוח</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Field: Course Name */}
            <div>
              <Label htmlFor="courseName">
                שם הקורס
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                  <BookOpen size={20} />
                </div>
                <Input
                  type="text"
                  id="courseName"
                  className="ps-12 pe-4 py-3"
                  placeholder="לדוגמה: מבני נתונים ואלגוריתמים"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field: Course Code */}
              <div>
                <Label htmlFor="courseCode">
                  קוד קורס
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap size={20} />
                  </div>
                  <Input
                    type="text"
                    id="courseCode"
                    className="ps-12 pe-4 py-3"
                    placeholder="לדוגמה: CS101"
                    required
                  />
                </div>
              </div>

              {/* Field: Semester */}
              <div>
                <Label htmlFor="semester">
                  סמסטר ושנה
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={20} />
                  </div>
                  <Input
                    type="text"
                    id="semester"
                    className="ps-12 pe-4 py-3"
                    placeholder="לדוגמה: סמסטר א׳ תשפ״ו"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Field: Description */}
            <div>
              <Label htmlFor="description">
                תיאור הקורס (אופציונלי)
              </Label>
              <div className="relative">
                <div className="absolute top-3 start-0 ps-4 flex items-start pointer-events-none text-gray-400">
                  <FileText size={20} />
                </div>
                <Textarea
                  id="description"
                  rows={4}
                  className="ps-12 pe-4 py-3 resize-none"
                  placeholder="תיאור קצר של מטרות ותכני הקורס..."
                ></Textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center justify-end gap-4">
              <LinkButton to="/lecturer/courses" variant="ghost" size="lg" className="px-6">
                <X size={20} />
                ביטול
              </LinkButton>
              <Button type="submit" variant="primary" size="lg">
                <Save size={20} />
                שמירת קורס
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
