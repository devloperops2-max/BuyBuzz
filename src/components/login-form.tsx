'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      // The useEffect will handle the redirect
    } catch (error: any) {
      const firebaseError = error as FirebaseError;
      console.error('Login Error:', firebaseError);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description:
          firebaseError.code === 'auth/invalid-credential'
            ? 'Invalid email or password.'
            : firebaseError.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalLoading = isUserLoading || isLoading;

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
          disabled={totalLoading}
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
          disabled={totalLoading}
        />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={totalLoading}>
        {totalLoading ? 'Logging In...' : 'Log In'}
      </Button>
    </form>
  );
}
