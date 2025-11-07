'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';

const interestsList = [
  'Modern Design',
  'Minimalism',
  'Bohemian',
  'Classic Elegance',
  'Sustainable Living',
  'Tech & Gadgets',
];

export function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    try {
      // This part is tricky. We need the user to be created to get the UID.
      // For this specific flow, we might need to handle user creation and document writing in sequence.
      // However, to stick with the non-blocking pattern, we'll listen for the user object.
      
      const tempUserCreationListener = auth.onAuthStateChanged(newUser => {
        if (newUser && newUser.email === email) {
          const userDocRef = doc(firestore, 'users', newUser.uid);
          const userData = {
            id: newUser.uid,
            email: newUser.email,
            firstName,
            lastName,
            interests,
          };
          setDocumentNonBlocking(userDocRef, userData, {});
          
          // Clean up the temporary listener
          tempUserCreationListener();
        }
      });
      
      initiateEmailSignUp(auth, email, password);

      toast({
        title: 'Account Created!',
        description: 'Redirecting you to the dashboard...',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} />
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
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
      </div>

      <div className="grid gap-3 pt-2">
        <Label>Select your interests</Label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {interestsList.map(interest => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest.toLowerCase().replace(/\s|&/g, '-')}
                onCheckedChange={() => handleInterestChange(interest)}
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

      <Button type="submit" className="w-full mt-2" disabled={isUserLoading}>
        Create Account
      </Button>
    </form>
  );
}
