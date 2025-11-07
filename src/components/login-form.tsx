'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { FirebaseError } from 'firebase/app';

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    initiateEmailSignIn(auth, email, password);
    // Non-blocking, auth state is handled by the useUser hook.
    // We can add a catch here for immediate form-level feedback if needed,
    // but global error handling is also in place.
    // For now, we rely on the listener to redirect on success.
    toast({
      title: 'Logging In...',
      description: 'Please wait while we check your credentials.',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={isUserLoading}>
        {isUserLoading ? 'Checking...' : 'Log In'}
      </Button>
    </form>
  );
}
