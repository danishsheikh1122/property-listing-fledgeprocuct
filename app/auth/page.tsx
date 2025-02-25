"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            emailRedirectTo: `${window.location.origin}/ownerprofile`,
          }
        });
        if (error) throw error;
        setError("Check your email for confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = "/ownerprofile";
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Authentication Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: `${window.location.origin}/ownerprofile`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });
    if (error) console.error("Google Auth Error:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-md">
        <Card className="bg-[#333A2F] border-0 shadow-xl">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#EBEDDF]">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-[#EBEDDF]/80 mt-2">
                {mode === "login"
                  ? "Sign in to your account"
                  : "Join our exclusive community"}
              </p>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {error && (
                <div className="text-red-300 text-sm text-center p-3 bg-[#333A2F]/50 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#EBEDDF]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#EBEDDF] border-[#333A2F]/20 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#EBEDDF]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#EBEDDF] border-[#333A2F]/20 h-11"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#EBEDDF] hover:bg-[#EBEDDF]/90 text-[#333A2F]"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EBEDDF]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#333A2F] text-[#EBEDDF]/80">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-[#EBEDDF] hover:bg-[#EBEDDF]/90 text-[#333A2F]"
              onClick={handleGoogleAuth}
            >
              Continue with Google
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 ml-2">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            </Button>

            <div className="text-center text-sm text-[#EBEDDF]/80">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-[#EBEDDF] font-medium hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-[#EBEDDF] font-medium hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}