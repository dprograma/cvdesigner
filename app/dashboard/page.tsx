'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Button } from '@/app/components/ui/button';
import { Loading } from '@/app/components/ui/loading';
import { ErrorMessage } from '@/app/components/ui/error-message';
import Link from 'next/link';
import { PlusCircle, FileText } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface Resume {
  id: string;
  name: string;
  created_at: string;
  template_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'loading') return; // Wait for session status to be determined

        if (status === 'unauthenticated') {
          router.push('/auth/login');
          return;
        }

        // Fetch user's resumes using Prisma
        const prismaResumes = await prisma.resume.findMany({
          where: {
            user_id: session?.user?.id as string // Use user ID from session
          },
          orderBy: {
            created_at: 'desc'
          }
        });

        setResumes(prismaResumes);
      } catch (err: unknown) {
        console.error('Error in dashboard:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading your dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, status, session?.user?.id]); // Add session status and user ID to dependencies

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  if (loading || status === 'loading') {
    return <Loading size="lg" text="Loading your resumes..." fullScreen />;
  }

  if (status === 'unauthenticated') {
    // This case is already handled by the useEffect redirect, but good as a fallback
    return null; // Or render a message/spinner if preferred
  }

  // Now we are sure the user is authenticated (status === 'authenticated')
  // and session.user is available

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <div className="flex space-x-4">
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <Link href="/templates">
          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>Create New Resume</span>
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first resume
          </p>
          <Link href="/templates">
            <Button>Create Resume</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{resume.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Created on {new Date(resume.created_at).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <Link href={`/resume-builder/${resume.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/resume-builder/${resume.id}/preview`}>
                    <Button size="sm">Preview</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
