"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px] flex flex-col items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="PodifyIt Logo" width={48} height={48} />
        </Link>

        <h1 className="text-2xl font-normal text-gray-900 mb-6 text-center">
          Sign in to PodifyIt
        </h1>

        {/* Card */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full bg-white border border-gray-300 rounded-md p-4"
        >
          <label
            htmlFor="login"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Username or email address
          </label>
          <input
            id="login"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-[7px] text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 mb-4"
          />

          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-900"
            >
              Password
            </label>
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-[7px] text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 mb-4"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition-colors text-white text-sm
              font-semibold rounded-md py-[7px]"
          >
            Sign in
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="flex flex-col gap-2">
            <SocialButton
              icon={<PasskeyIcon />}
              label="Continue with passkey"
            />
            <SocialButton icon={<GoogleIcon />} label="Continue with Google" />
            <SocialButton icon={<AppleIcon />} label="Continue with Apple" />
          </div>
        </form>

        <p className="text-sm text-gray-900 mt-4">
          New to PodifyIt?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
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

// function GitHubMark({ className }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
//       <path
//         d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
//         0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
//         1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
//         0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27
//         2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
//         2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
//         3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
//         .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
//       />
//     </svg>
//   );
// }

function PasskeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path
        d="M8 1a3 3 0 1 0 1.6 5.55c.3.3.7.45 1.1.45H12v1a1 1 0 0 0 1 1h1v1a1 1 0 0
        1-1 1h-3.3a3 3 0 1 0 0 2H10a2 2 0 0 0 2-2v-.17A2 2 0 0 0 14
        9V7a1 1 0 0 0-1-1h-1V5a1 1 0 0 0-1-1H9.7A3 3 0 0 0 8 1Zm-1.5
        3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM5 12.5a1 1 0 1 1
        0 2 1 1 0 0 1 0-2Z"
      />
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
