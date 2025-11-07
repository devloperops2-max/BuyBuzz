import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create an account</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline text-primary font-medium">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
