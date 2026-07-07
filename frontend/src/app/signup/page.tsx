"use client";

import Link from "next/link";
import { useState } from "react";

const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "India",
  "South Africa",
  "Kenya",
  "Ghana",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Top bar */}
      <div className="w-full flex justify-end px-6 py-4">
        <p className="text-sm text-gray-900">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold underline">
            Log in →
          </Link>
        </p>
      </div>

      <div className="w-full max-w-[460px] mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Sign up for PodifyIt
        </h1>

        <div className="flex flex-col gap-2 mb-4">
          <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
          <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5"
        >
          <Field label="Email" required>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </Field>

          <Field label="Password" required>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Password should be at least 15 characters OR at least 8 characters
              including a number and a lowercase letter.
            </p>
          </Field>

          <Field label="Username" required>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Username may only contain alphanumeric characters or single
              hyphens, and cannot begin or end with a hyphen.
            </p>
          </Field>

          <Field label="Your Country/Region" required>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none pr-9 cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              For compliance reasons, we&apos;re required to collect country
              information to send you occasional updates and announcements.
            </p>
          </Field>


          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Email preferences
            </h2>
            <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(e) => setEmailUpdates(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-blue-600"
              />
              <span>Receive occasional product updates and announcements</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700
              transition-colors text-white text-sm font-semibold rounded-md py-2.5"
          >
            Create account
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-gray-500">
            By creating an account, you agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            . For more information about PodifyIt privacy practices, see the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              PodifyIt Privacy Statement
            </a>
            . We&apos;ll occasionally send you account-related emails.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-1.5">
        {label}
        {required && <span className="text-gray-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md
        py-[7px] text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24
        36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5
        6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.9
        1.2 8 3.1l5.7-5.7C34.5 7.1 29.5 4 24 4c-7.5 0-14 4.2-17.7 10.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2 14-5.4l-6.5-5.4C29.4 34.9
        26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.9l-6.6 5.1C9.9 39.8 16.4 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1
        5.4l6.5 5.4C39.7 37.4 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M12.15 8.35c-.02-1.53 1.25-2.27 1.3-2.3-.7-1.03-1.8-1.17-2.2-1.19-.94-.1-1.83.55-2.31.55-.48
        0-1.22-.53-2-.52-1.03.02-1.98.6-2.51 1.53-1.07 1.86-.27 4.6.77 6.1.51.74 1.11 1.56 1.9
        1.53.76-.03 1.05-.49 1.97-.49.92 0 1.18.49 1.99.48.82-.02 1.34-.75 1.84-1.5.58-.86.82-1.7.83-1.74-.02-.01-1.58-.61-1.6-2.4Z
        M10.42 3.6c.42-.51.7-1.22.62-1.93-.6.02-1.34.4-1.77.9-.39.44-.73 1.16-.64 1.85.67.05 1.36-.34 1.79-.82Z"
      />
    </svg>
  );
}
