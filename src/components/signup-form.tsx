'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { FirebaseError } from 'firebase/app';

const interestsList = [
  'Modern Design',
  'Minimalism',
  'Bohemian',
  'Classic Elegance',
  'Sustainable Living',
  'Tech & Gadgets',
  'Electronics',
];

export function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isAuthLoading, router]);

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !auth) {
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Firebase is not ready. Please try again in a moment.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // 2. Create user profile data
      const userDocRef = doc(firestore, 'users', newUser.uid);
      const userData = {
        id: newUser.uid,
        email: newUser.email,
        firstName,
        lastName,
        interests,
        createdAt: serverTimestamp(),
      };

      // 3. Save the user profile to Firestore
      await setDoc(userDocRef, userData);

      toast({
        title: 'Account Created!',
        description: 'Redirecting you to the dashboard...',
      });

      // The useEffect will handle the redirect once the user state is updated.
    } catch (error: any) {
      const firebaseError = error as FirebaseError;
      console.error('Sign Up Error:', firebaseError);
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description:
          firebaseError.code === 'auth/email-already-in-use'
            ? 'This email is already registered.'
            : firebaseError.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isAuthLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} disabled={isLoading} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} disabled={isLoading} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
      </div>

      <div className="grid gap-3 pt-2">
        <Label>Select your interests</Label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {interestsList.map(interest => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest.toLowerCase().replace(/\s|&/g, '-')}
                onCheckedChange={() => handleInterestChange(interest)}
                disabled={isLoading}
              />
              <Label
                htmlFor={interest.toLowerCase().replace(/\s|&/g, '-')}
                className="text-sm font-normal"
              >
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}