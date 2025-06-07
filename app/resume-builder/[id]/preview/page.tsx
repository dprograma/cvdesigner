'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EducationItem, ExperienceItem, SkillItem, ResumeWithTemplate } from '../page';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

interface ResumePreviewPageProps {
  params: Promise<{ id: string }>;
}

export default function ResumePreviewPage({ params }: ResumePreviewPageProps) {
  // Type assertion to treat params as the resolved value at runtime
  const { id } = params as unknown as { id: string };
  const router = useRouter();
  const [resume, setResume] = useState<ResumeWithTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        if (status === 'loading') return; // Wait for session status

        if (status === 'unauthenticated') {
          router.push('/auth/login');
          return;
        }

        if (!session?.user?.id) {
          console.error('User not authenticated or missing ID');
          router.push('/auth/login');
          return;
        }

        // Fetch resume using Prisma
        const resumeData = await prisma.resume.findUnique({
          where: {
            id: id,
            user_id: session.user.id,
          },
          include: {
            template: true,
          },
        });

        if (!resumeData) {
          console.error('Resume not found or unauthorized access');
          router.push('/dashboard');
          return;
        }

        setResume(resumeData as ResumeWithTemplate);
        setLoading(false);
      } catch (err: unknown) {
        console.error('Error fetching resume:', err);
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id, router, status, session?.user?.id]);

  const generatePDF = async () => {
    if (!resumeRef.current) return;

    setGenerating(true);

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${resume?.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resume Preview</h1>
        <div className="flex space-x-4">
          <Link href={`/resume-builder/${id}`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Editor</span>
            </Button>
          </Link>
          <Button
            onClick={generatePDF}
            disabled={generating}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{generating ? 'Generating...' : 'Download PDF'}</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div
          ref={resumeRef}
          className="bg-white p-8 min-h-[1123px] w-full"
          style={{ aspectRatio: '1 / 1.414' }} // A4 aspect ratio
        >
          {resume?.data?.personal && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-center mb-2">
                {resume.data.personal.fullName || 'Your Name'}
              </h1>
              {resume.data.personal.jobTitle && (
                <p className="text-xl text-center text-gray-600 mb-4">
                  {resume.data.personal.jobTitle}
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-600">
                {resume.data.personal.email && (
                  <span>{resume.data.personal.email}</span>
                )}
                {resume.data.personal.phone && (
                  <span>{resume.data.personal.phone}</span>
                )}
                {resume.data.personal.location && (
                  <span>{resume.data.personal.location}</span>
                )}
                {resume.data.personal.website && (
                  <span>{resume.data.personal.website}</span>
                )}
                {resume.data.personal.linkedin && (
                  <span>{resume.data.personal.linkedin}</span>
                )}
              </div>

              {resume.data.personal.summary && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
                  <p className="text-sm">{resume.data.personal.summary}</p>
                </div>
              )}
            </div>
          )}

          {resume?.data?.experience && resume.data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-3">Work Experience</h2>

              {resume.data.experience.map((exp: ExperienceItem) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exp.position}</h3>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {exp.location && <p>{exp.location}</p>}
                      {(exp.startDate || exp.endDate) && (
                        <p>
                          {exp.startDate || ''} {exp.startDate && exp.endDate ? '–' : ''} {exp.endDate || ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {resume?.data?.education && resume.data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-3">Education</h2>

              {resume.data.education.map((edu: EducationItem) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</h3>
                      <p className="text-sm">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {edu.location && <p>{edu.location}</p>}
                      {(edu.startDate || edu.endDate) && (
                        <p>
                          {edu.startDate || ''} {edu.startDate && edu.endDate ? '–' : ''} {edu.endDate || ''}
                        </p>
                      )}
                      {edu.gpa && <p>GPA: {edu.gpa}</p>}
                    </div>
                  </div>

                  {edu.description && (
                    <p className="text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {resume?.data?.skills && resume.data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold border-b pb-1 mb-3">Skills</h2>

              {resume.data.skills.map((category: SkillItem) => (
                <div key={category.id} className="mb-3">
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-sm">{category.skills}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
