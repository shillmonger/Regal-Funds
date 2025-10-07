"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";

// 🎨 Theme constants
const bgLight = "bg-white dark:bg-gray-950";
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLight = "text-gray-500 dark:text-gray-400";
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-emerald-500 dark:focus:border-emerald-400";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const callbackUrl = searchParams.get("callbackUrl") || "/user-dashboard/dashboard";

  // 🚀 Auto-redirect logged-in users (prevent redirect loops)
  useEffect(() => {
    if (status === "authenticated" && !window.location.pathname.startsWith("/user-dashboard")) {
      router.replace("/user-dashboard/dashboard");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
        callbackUrl,
      });

      if (!result) throw new Error("No response from auth server");
      if (result.error) throw new Error(result.error);

      toast.success("Login successful");
      router.push(result.url || "/user-dashboard/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  // 🕐 Prevent flashing login form during session check
  if (status === "loading") {
    return <div className="text-center mt-20 text-gray-500">Checking session...</div>;
  }

  // ✅ Don’t render login form for already logged-in users
  if (status === "authenticated") {
    return null;
  }

  return (
    <div>
      <div className={`flex min-h-screen items-center justify-center ${bgLight} px-4 py-8`}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
                alt="Logo"
                className="h-10 w-auto block dark:hidden"
              />
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
                alt="Logo"
                className="h-10 w-auto hidden dark:block"
              />
            </div>
          </Link>

          {/* Card */}
          <Card className={`${cardBg} shadow-lg border-gray-100 dark:border-gray-800`}>
            <CardHeader className="pb-6">
              <CardTitle className={`text-center text-2xl font-bold ${textDark}`}>
                Welcome back
              </CardTitle>
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <Label htmlFor="email" className={`text-sm font-medium ${textDark}`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`mt-1 h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                    required
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className={`text-sm font-medium ${textDark}`}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10`}
                      required
                      onChange={handleChange}
                      value={form.password}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Links */}
              <p className={`text-sm text-center ${textMedium} mt-6`}>
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-emerald-500 hover:underline font-medium">
                  Sign up
                </Link>
              </p>

              <p className="text-sm text-center">
                <Link
                  href="/auth/forgot-password"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline"
                >
                  Forgot your password?
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center space-y-2">
            <p className={`text-xs ${textLight}`}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className={`text-xs ${textLight}`}>
              All activities are logged for security and compliance purposes.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
