import type { Route } from "./+types/student.appeal";
import MainLayout from "../components/MainLayout";
import { ChevronRight, FileText, UploadCloud, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Select, Textarea, Label } from '../components/ui/Input';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appeal Assignment | Check Hit" },
  ];
}

export default function StudentAppealRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <MainLayout portalName={isEn ? "Student Portal" : "פורטל סטודנטים"} view="student">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="transform rotate-180" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('appealForm.successTitle')}</h1>
          <p className="text-gray-500 max-w-md text-center mb-8">{t('appealForm.successDesc')}</p>
          <Link to="/student/assignments" className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
            {t('appealForm.backToAssignments')}
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName={isEn ? "Student Portal" : "פורטל סטודנטים"} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/student/assignments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            <ChevronRight size={16} className={isEn ? "rotate-180" : ""} /> {t('appealForm.cancelAndReturn')}
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">{t('appealForm.title')}</h1>
          <p className="text-gray-500 mt-2">{isEn ? 'Assignment 2: Quick Sort (Grade: 82)' : 'מטלה 2: מיון מהיר (ציון: 82)'}</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
            <AlertCircle className="shrink-0 text-blue-500" />
            <div>
              <strong className="block mb-1">{t('appealForm.noticeTitle')}</strong>
              {t('appealForm.noticeDesc')}
            </div>
          </div>

          <div>
            <Label>{t('appealForm.categoryLabel')}</Label>
            <Select>
              <option value="">{t('appealForm.categorySelect')}</option>
              <option value="grading_error">{t('appealForm.catGradingError')}</option>
              <option value="misunderstanding">{t('appealForm.catMisunderstanding')}</option>
              <option value="technical">{t('appealForm.catTechnical')}</option>
              <option value="other">{t('appealForm.catOther')}</option>
            </Select>
          </div>

          <div>
            <Label>{t('appealForm.detailsLabel')}</Label>
            <Textarea 
              required
              minLength={20}
              rows={6}
              className="resize-none"
              placeholder={t('appealForm.detailsPlaceholder')}
            ></Textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('appealForm.filesLabel')}</label>
            {!selectedFile ? (
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer group">
                <input type="file" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-[#00857e] transition-colors">
                  <UploadCloud size={28} />
                </div>
                <p className="text-gray-700 font-bold mb-1">{t('appealForm.dragFiles')}</p>
                <p className="text-sm text-gray-500">{t('appealForm.pdfOnly')}</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 w-full p-4 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-teal-50 text-[#00857e] rounded-full flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 truncate text-start" dir="ltr">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 text-start">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button 
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  disabled={isSubmitting}
                >
                  {t('appealForm.removeFile')}
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              variant="primary"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{t('appealForm.submitting')}</>
              ) : (
                <>{t('appealForm.submitBtn')}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
