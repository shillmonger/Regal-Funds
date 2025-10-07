"use client"

import Link from "next/link"
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Theme Constants from PlansPage
const primary = "#10B981";       // Emerald green
const primaryDarker = "#059669"; // Darker Emerald for hover
const bgLight = "bg-white dark:bg-gray-950"; // Page background
const cardBg = "bg-white dark:bg-gray-900";  // Card background
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const textLabel = "text-gray-700 dark:text-gray-200";
const textLight = "text-gray-500 dark:text-gray-400";
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-emerald-500 dark:focus:border-emerald-400";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [understoodPurpose, setUnderstoodPurpose] = useState(false)
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Registration failed");
      return;
    }

    toast.success("Account created successfully!");
    router.push("/user-dashboard/dashboard");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={bgLight}>
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
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

          <Card className={`${cardBg} shadow-lg border-gray-100 dark:border-gray-800`}>
            <CardHeader className="pb-6">
              <CardTitle className={`text-center text-2xl font-bold ${textDark}`}>
                Create your account
              </CardTitle>
              <p className={`text-center ${textMedium} text-sm mt-2`}>
                Start your cybersecurity learning journey today
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {["username","email","password","confirmPassword"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field} className={`text-sm font-medium ${textLabel}`}>
                      {field === "username" ? "Username" : field === "email" ? "Email" : field === "password" ? "Password" : "Confirm Password"}
                    </Label>
                    <div className={field.includes("password") ? "relative mt-1" : ""}>
                      <Input
                        id={field}
                        type={field.includes("password") && (field==="password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")) || (field==="email"?"email":"text")}
                        placeholder={field==="username"?"Choose a username":field==="email"?"your@email.com":field==="password"?"Create a strong password":"Confirm your password"}
                        className={`h-11 ${inputBg} ${inputBorder} ${focusBorder} ${textDark} placeholder:text-gray-400 dark:placeholder:text-gray-500 ${field.includes("password")?"pr-10":""}`}
                        required
                        value={form[field as keyof typeof form]}
                        onChange={handleChange}
                      />
                      {field.includes("password") && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => field==="password"?setShowPassword(!showPassword):setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {field==="password" ? (showPassword ? <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" /> : <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />)
                          : (showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" /> : <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />)}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(value) => setAgreedToTerms(value === true)}
                      className={`mt-0.5 border-gray-400 data-[state=checked]:bg-[${primary}] data-[state=checked]:text-white dark:border-gray-600 dark:data-[state=checked]:bg-[${primaryDarker}]`}
                    />
                    <label htmlFor="terms" className={`text-sm ${textMedium} leading-5`}>
                      I agree to the{" "}
                      <Link href="/landing/legalpages/terms" className={`text-emerald-500 hover:underline`}>
                        Terms of Service
                      </Link>{" "}and{" "}
                      <Link href="/landing/legalpages/privacy" className={`text-emerald-500 hover:underline`}>
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                </div>

  <Button
  type="submit"
  className={`w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium cursor-pointer`}
  disabled={!agreedToTerms || loading}
>
  {loading ? "Creating..." : "Create Account"}
</Button>


              </form>

              <p className={`text-sm text-center ${textMedium} mt-6`}>
                Already have an account?{" "}
                <Link href="/auth/login" className={`text-emerald-500 hover:underline font-medium`}>
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 text-center space-y-2">
  <p className={`text-xs ${textLight}`}>
    By creating an account, you acknowledge that all activities are logged for security and compliance purposes.
  </p>
  <p className={`text-xs ${textLight}`}>
    CryptoInvest is committed to providing a secure and reliable investment platform.
  </p>
</div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
