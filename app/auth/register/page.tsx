"use client";

import Link from "next/link";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

// 🎨 Theme constants (matches Login page)
const primaryColor = "#448D96"; // teal-green
const primaryHover = "#3a7d85"; // slightly darker teal
const accentColor = "text-gray-900";
const secondaryText = "text-gray-600";
const linkText = "text-gray-500";
const backgroundColor = "bg-gray-50";
const cardBackground = "bg-white";
const inputBackground = "bg-white";
const inputBorderColor = "border-gray-200";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams?.get("ref");
    if (q && !form.referralCode) {
      setForm((f) => ({ ...f, referralCode: q }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ref = (form.referralCode || "").trim() || searchParams?.get("ref") || null;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ref }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");
      // Auto sign-in using the same credentials
      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      router.push("/user-dashboard/dashboard?welcome=1");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${backgroundColor} min-h-screen flex flex-col`}>
      {/* ✅ Header stays consistent with Login */}
      <Header />

      <div className="flex flex-1 items-center justify-center px-4 py-8 mt-[100px]">
        <div className="w-full max-w-md">
          <Card className={`${cardBackground} shadow-xl border-gray-100`}>
            <CardHeader className="pb-6">
              <CardTitle className={`text-center text-2xl font-bold ${accentColor}`}>
                Create your account
              </CardTitle>
              <p className={`text-center ${secondaryText} text-sm mt-2`}>
                Start your investment journey today
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Input Fields */}
                {["username", "email", "password", "confirmPassword"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className={`text-sm font-medium ${accentColor}`}>
                      {field === "username"
                        ? "Username"
                        : field === "email"
                        ? "Email"
                        : field === "password"
                        ? "Password"
                        : "Confirm Password"}
                    </Label>
                    <div className={field.includes("password") ? "relative mt-1" : "mt-1"}>
                      <Input
                        id={field}
                        type={
                          field.includes("password")
                            ? field === "password"
                              ? showPassword
                                ? "text"
                                : "password"
                              : showConfirmPassword
                              ? "text"
                              : "password"
                            : field === "email"
                            ? "email"
                            : "text"
                        }
                        placeholder={
                          field === "username"
                            ? "Choose a username"
                            : field === "email"
                            ? "your@email.com"
                            : field === "password"
                            ? "Create a strong password"
                            : "Confirm your password"
                        }
                        className={`h-11 ${inputBackground} ${inputBorderColor} border w-full px-3 rounded-md ${accentColor} placeholder:text-gray-400`}
                        required
                        value={form[field as keyof typeof form]}
                        onChange={handleChange}
                      />
                      {field.includes("password") && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            field === "password"
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {field === "password" ? (
                            showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )
                          ) : showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  <Label htmlFor="referralCode" className={`text-sm font-medium ${accentColor}`}>
                    Referral Code (optional)
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Enter referral code if you have one"
                      className={`h-11 ${inputBackground} ${inputBorderColor} border w-full px-3 rounded-md ${accentColor} placeholder:text-gray-400`}
                      value={form.referralCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(value) => setAgreedToTerms(value === true)}
                      className="mt-0.5 border-gray-400 data-[state=checked]:bg-[#448D96] data-[state=checked]:text-white"
                    />
                    <label htmlFor="terms" className={`text-sm ${secondaryText} leading-5`}>
                      I agree to the{" "}
                      <Link href="/landing/legalpages/terms" className={`${linkText} hover:underline`}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/landing/legalpages/privacy" className={`${linkText} hover:underline`}>
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!agreedToTerms || loading}
                  className="w-full h-11 text-white font-medium cursor-pointer hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>

              {/* Links */}
              <p className={`text-sm text-center ${secondaryText} mt-6`}>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="hover:underline font-medium"
                  style={{ color: primaryColor }}
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center space-y-2">
            <p className={`text-xs ${linkText}`}>
              By creating an account, you acknowledge that all activities are logged for security and compliance purposes.
            </p>
            <p className={`text-xs ${linkText}`}>
              Regal Funds is committed to providing a secure and reliable investment platform.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
