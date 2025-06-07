'use client';

import { useState } from 'react';
import { ErrorMessage } from '@/app/components/ui/error-message';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

interface AuthFormProps {
  onSubmit: (email: string, password?: string) => void;
  isSignUp?: boolean;
  loading: boolean;
  error: string | null;
}

export default function AuthForm({
  onSubmit,
  isSignUp = false,
  loading,
  error,
}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </div>
    </form>
  );
}
