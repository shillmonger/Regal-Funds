"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header"; // ✅ Imported Header
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
const primaryColor = "#448D96";
const primaryHover = "#3a7d85";
const accentColor = "text-gray-900";
const secondaryText = "text-gray-600";
const linkText = "text-gray-500";
const backgroundColor = "bg-gray-50";
const cardBackground = "bg-white";
const inputBackground = "bg-white";
const inputBorderColor = "border-gray-200";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const callbackUrl =
    searchParams.get("callbackUrl") || "/user-dashboard/dashboard";

  useEffect(() => {
    if (
      status === "authenticated" &&
      !window.location.pathname.startsWith("/user-dashboard")
    ) {
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

  if (status === "loading") {
    return <div className="text-center mt-20 text-gray-500">Checking session...</div>;
  }

  if (status === "authenticated") return null;

  return (
    <div>
      {/* ✅ Header added at the top */}
      <Header />

      <div className={`flex min-h-screen items-center justify-center mt-[50px] ${backgroundColor} px-4 py-8`}>
        <div className="w-full max-w-md">
          <Card className={`${cardBackground} shadow-xl border-gray-100`}>
            <CardHeader className="pb-6">
              <CardTitle className={`text-center text-2xl font-bold ${accentColor}`}>
                Welcome back
              </CardTitle>
              <p className={`text-center ${secondaryText} text-sm mt-2`}>
                Enter your credentials to access your dashboard
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <Label htmlFor="email" className={`text-sm font-medium ${accentColor}`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`mt-1 h-11 ${inputBackground} ${inputBorderColor} border focus:border-[${primaryColor}] ${accentColor} placeholder:text-gray-400`}
                    required
                    onChange={handleChange}
                    value={form.email}
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className={`text-sm font-medium ${accentColor}`}>
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`h-11 ${inputBackground} ${inputBorderColor} border focus:border-[${primaryColor}] ${accentColor} placeholder:text-gray-400 pr-10`}
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
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  style={{
                    backgroundColor: primaryColor,
                  }}
                  className="w-full h-11 text-white font-medium cursor-pointer hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Links */}
              <p className={`text-sm text-center ${secondaryText} mt-6`}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="hover:underline font-medium"
                  style={{ color: primaryColor }}
                >
                  Sign up
                </Link>
              </p>

              <p className="text-sm text-center">
                <Link
                  href="/auth/forgot-password"
                  className={`${linkText} hover:text-gray-700 hover:underline`}
                >
                  Forgot your password?
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer info */}
          <div className="mt-6 text-center space-y-2">
            <p className={`text-xs ${linkText}`}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p className={`text-xs ${linkText}`}>
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
