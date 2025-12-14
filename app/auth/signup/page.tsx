"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signup } from "@/lib/actions/user.actions";
import { BookOpen, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);
      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/signin");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join our community of book lovers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="h-11 transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="h-11 transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
