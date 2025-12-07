import { useState } from "react";
import logo from "../assets/images/logo.png";
import { API_BASE_URL } from "../config/ApiConfig";

function SignInPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Login failed");
        return;
      }

      setSuccess(`Logged in as ${data.firstName} ${data.lastName} (${data.role})`);
      setPassword("");
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Sign-in error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2e2e2e' }}>
      <div className="rounded-xl p-8 shadow-2xl" style={{ backgroundColor: '#3c3c3c', width: '420px' }}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-24 w-auto rounded-lg mb-4" />
          <h1 className="text-2xl font-semibold text-slate-100">Sign in to PDCA Alert Manager</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your login"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-emerald-400">
              {success}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: '#3b82f6' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;
