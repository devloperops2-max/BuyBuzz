"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const interests = [
  "Modern Design",
  "Minimalism",
  "Bohemian",
  "Classic Elegance",
  "Sustainable Living",
  "Tech & Gadgets",
];

export function SignupForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you'd handle authentication and save interests.
    // For this scaffold, we'll just redirect to the dashboard.
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" placeholder="Max" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Robinson" required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
      </div>
      
      <div className="grid gap-3 pt-2">
        <Label>Select your interests</Label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {interests.map((interest) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox id={interest.toLowerCase().replace(/\s|&/g, "-")} />
              <Label
                htmlFor={interest.toLowerCase().replace(/\s|&/g, "-")}
                className="text-sm font-normal"
              >
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full mt-2">
        Create Account
      </Button>
    </form>
  );
}
