import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Sparkles } from "lucide-react";

interface AuthFormProps {
  onLogin: (accessToken: string, user: any) => void;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "signup";
      const body = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-bfa263b0/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (isLogin) {
        onLogin(data.accessToken, data.user);
      } else {
        setIsLogin(true);
        setName("");
        setPassword("");
        setError("Account created! Please login.");
      }
    } catch (err: any) {
      setError(err.message || "Network error - please check your connection");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3EFFE] p-4">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-[#C4B5E8]/20 border border-[#DDD6F3] p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#C4B5E8] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#6B4EAF]">TaskFlow AI</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2D1B6B] mb-1">
            {isLogin ? "Welcome back!" : "Create your account"}
          </h1>
          <p className="text-[#9B8BC0] text-sm">
            {isLogin ? "Sign in to continue to your workspace" : "Get started for free today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#4B3499] mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#DDD6F3] rounded-lg focus:ring-2 focus:ring-[#C4B5E8] focus:border-[#C4B5E8] outline-none text-[#2D1B6B] placeholder-[#C4B5E8] bg-[#FDFCFF] transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#4B3499] mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-[#DDD6F3] rounded-lg focus:ring-2 focus:ring-[#C4B5E8] focus:border-[#C4B5E8] outline-none text-[#2D1B6B] placeholder-[#C4B5E8] bg-[#FDFCFF] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4B3499] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-[#DDD6F3] rounded-lg focus:ring-2 focus:ring-[#C4B5E8] focus:border-[#C4B5E8] outline-none text-[#2D1B6B] placeholder-[#C4B5E8] bg-[#FDFCFF] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes("created")
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4B5E8] text-[#3D2876] py-2.5 rounded-lg font-medium hover:bg-[#B4A2DE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-[#8B6ED4] hover:text-[#6B4EAF] text-sm font-medium transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}