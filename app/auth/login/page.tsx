'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '@/app/components/auth/AuthForm';
import { ErrorMessage } from '@/app/components/ui/error-message';
import { Loading } from '@/app/components/ui/loading';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);
  const router = useRouter();
  const { status } = useSession();
  const isLoading = status === 'loading' || isCheckingConfig;

  useEffect(() => {
    // Check for error parameter in URL
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }

    // Check Supabase configuration
    const checkConfig = async () => {
      try {
        setIsCheckingConfig(true);

      } catch (err: unknown) {
        console.error('Error checking config:', err);
        // setConfigError('Failed to check configuration.'); // Removed as configError state is removed
      } finally {
        setIsCheckingConfig(false);
      }
    };

    checkConfig();
  }, [searchParams]);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (isCheckingConfig || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading text="Checking configuration..." />
      </div>
    );
  }

  const handleSignIn = async (email: string, password?: string) => {
    setError(null);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or create a new account to start building your resume
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        <AuthForm onSubmit={handleSignIn} loading={isLoading} error={error} />

        {/* Add a link for signing up if needed */}
        {/* <div className="text-center text-sm text-gray-500 mt-4">
          Don't have an account? <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link>
        </div> */}
      </div>
    </div>
  );
}
