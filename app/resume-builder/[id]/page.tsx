'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import PersonalInfoForm from '@/app/components/forms/PersonalInfoForm';
import EducationForm from '@/app/components/forms/EducationForm';
import ExperienceForm from '@/app/components/forms/ExperienceForm';
import SkillsForm from '@/app/components/forms/SkillsForm';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { ErrorMessage } from '@/app/components/ui/error-message';
export interface Resume {
  id: string;
  name: string;
  created_at: string;
  template_id: string;
  user_id: string;
  data: ResumeData;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
  jobTitle?: string;
  location?: string;
}

export interface EducationItem {
  id?: string; // Made id optional
  institution: string;
  degree: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  fieldOfStudy?: string;
  gpa?: string;
}

export interface ExperienceItem {
  id?: string; // Made id optional
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface SkillItem {
  id?: string; // Made id optional
  name: string;
  skills: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  // Add other resume sections as needed
}

export interface Template {
  id: string;
  name: string;
  thumbnail_url: string;
  file_url: string;
  created_at: string;
}

export interface ResumeWithTemplate extends Omit<Resume, 'template_id'> {
  data: ResumeData;
  template: Template; // Prisma includes the relation directly
}

interface ResumeBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function ResumeBuilderPage({ params }: ResumeBuilderPageProps) {
  // Type assertion to treat params as the resolved value at runtime
  const { id } = params as unknown as { id: string };
  const router = useRouter();
  const [resume, setResume] = useState<ResumeWithTemplate | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: { fullName: '', email: '' },
    education: [],
    experience: [],
    skills: []
  });
  const [error, setError] = useState<string | null>(null);

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
        setTemplate(resumeData.template);

        // Initialize resume data
        if (resumeData.data) {
          setResumeData(resumeData.data as ResumeData);
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error('Error fetching resume:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading your resume.');
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [id, router, status, session?.user?.id]);

  const saveResumeData = async () => {
    setSaving(true);

    try {
      if (!session?.user?.id) {
        console.error('User not authenticated or missing ID');
        setError('Authentication error. Please sign in again.'); // Set error for UI
        setSaving(false);
        return;
      }

      // Save resume data using Prisma
      await prisma.resume.update({
        where: {
          id: id,
          user_id: session.user.id, // Ensure user owns the resume
        },
        data: {
          data: resumeData,
        },
      });

    } catch (error: unknown) {
      console.error('Error saving resume data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save resume data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (data: PersonalInfo) => {
    setResumeData((prev: ResumeData) => ({
      ...prev,
      personal: data
    }));
  };

  const updateEducation = (data: EducationItem[]) => {
    setResumeData((prev: ResumeData) => ({
      ...prev,
      education: data
    }));
  };

  const updateExperience = (data: ExperienceItem[]) => {
    setResumeData((prev: ResumeData) => ({
      ...prev,
      experience: data
    }));
  };

  const updateSkills = (data: SkillItem[]) => {
    setResumeData((prev: ResumeData) => ({
      ...prev,
      skills: data
    }));
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // This case is handled by the useEffect redirect, but good as a fallback
    return null; // Or render a message/spinner if preferred
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{resume?.name || 'Resume Builder'}</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Button
            onClick={saveResumeData}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Link href={`/resume-builder/${id}/preview`}>
            <Button>Preview</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="personal" className="flex-1">Personal Info</TabsTrigger>
              <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
              <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
              <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <PersonalInfoForm
                initialData={resumeData.personal}
                onSave={updatePersonalInfo}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationForm
                initialData={resumeData.education}
                onSave={updateEducation}
              />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceForm
                initialData={resumeData.experience}
                onSave={updateExperience}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsForm
                initialData={resumeData.skills}
                onSave={updateSkills}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-medium text-lg mb-4">Template Preview</h3>
              {template && (
                <div className="aspect-w-3 aspect-h-4 bg-gray-100 rounded overflow-hidden relative">
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-lg mb-4">Tips</h3>
              <ul className="space-y-2 text-sm">
                <li>• Keep your resume concise and relevant</li>
                <li>• Use action verbs to describe your experience</li>
                <li>• Quantify your achievements when possible</li>
                <li>• Proofread for spelling and grammar errors</li>
                <li>• Tailor your resume for each job application</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
