"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { FileUpload } from "@/app/components/ui/file-upload";
import { Loading } from "@/app/components/ui/loading";
import { ErrorMessage } from "@/app/components/ui/error-message";
import Link from "next/link";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

interface Template {
  id: string;
  name: string;
  thumbnail_url: string;
  description: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const { status } = useSession();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setError(null);
        if (status === 'loading') return; // Wait for session status

        if (status === 'unauthenticated') {
          router.push('/auth/login');
          return;
        }

        // Fetch templates using Prisma
        const templates = await prisma.template.findMany({
          orderBy: {
            created_at: 'desc',
          },
        });

        setTemplates(templates || []);
      } catch (err: unknown) {
        console.error("Error in templates page:", err);
        setError(err instanceof Error ? err.message : "An error occurred while loading templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [router, status]);

  const handleFileSelect = async (file: File) => {
    setUploadingTemplate(true);
    setError(null);

    try {
      // TODO: Implement file upload and template creation using a different storage solution and Prisma
      console.log("File selected for upload:", file.name);
      setError("Template upload is not yet implemented after Supabase removal.");
    } catch (err: unknown) {
      console.error("Error uploading template:", err);
      setError(err instanceof Error ? err.message : "Failed to upload template. Please try again.");
    } finally {
      setUploadingTemplate(false);
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading templates..." fullScreen />;
  }

  if (uploadMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload Your Template</h1>

          {error && <ErrorMessage message={error} />}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <p className="mb-4 text-gray-700">
              Upload a resume template (PDF or image) to use as a base for your
              new resume. Our system will analyze the layout and help you fill
              in your information.
            </p>

            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                "application/pdf": [".pdf"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
              }}
              label="Upload your resume template"
            />

            {uploadingTemplate && (
              <div className="mt-4">
                <Loading size="sm" text="Processing template..." />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setUploadMode(false);
                setError(null);
              }}
              disabled={uploadingTemplate}
            >
              Back to Templates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Choose a Template</h1>
        <div className="flex space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <Button
          onClick={async () => {
            try {
              setError(null);

              setUploadMode(true);
            } catch (err: unknown) {
              console.error("Error setting upload mode:", err);
              setError(
                err instanceof Error ? err.message : "An error occurred. Please try again."
              );
            }
          }}
        >
          Upload Your Own Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-100 relative">
              <Image
                src={template.thumbnail_url}
                alt={template.name}
                fill={true}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {template.description}
              </p>
              <Button
                onClick={async () => {
                  try {
                    // TODO: Implement resume creation using Prisma
                    console.log("Using template:", template.name);
                    setError("Resume creation is not yet implemented after Supabase removal.");
                  } catch (err: unknown) {
                    console.error("Error using template:", err);
                    setError(
                      err instanceof Error ? err.message : "An error occurred. Please try again."
                    );
                  }
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
