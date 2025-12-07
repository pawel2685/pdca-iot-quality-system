import { useState } from "react";
import logo from "../assets/images/logo.png";
import { API_BASE_URL } from "../config/ApiConfig";

function SignUpPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    } 

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
        email,
        firstName: name,
        lastName,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Sign up failed.");
      return;
    }
    
    setSuccess("Sign up successful! You can now sign in.");
    setName("");
    setLastName("");  
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  } catch (err) {
    setError("An unexpected error occurred.");
    console.error("Sign up error:", (err as Error).message);
  } 
};


  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2e2e2e' }}>
      <div className="rounded-xl p-8 shadow-2xl" style={{ backgroundColor: '#3c3c3c', width: '420px' }}>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-24 w-auto rounded-lg mb-4" />
          <h1 className="text-2xl font-semibold text-slate-100">Sign up to PDCA Alert Manager</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-600 text-white text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-600 text-white text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-200 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: '#3b82f6' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
