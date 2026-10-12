
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { RESEND_OTP, VERIFY_OTP } from "@/constants/Routes";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOtpChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete six-digit verification code.");
      return;
    }

    setVerifying(true);

    try {
      const response = await api.post(
        VERIFY_OTP,
        { email, otp }
      );

      setMessage(
        response.data?.message || "Email verified successfully."
      );

      router.replace("/login?verified=true");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Please check your code."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    setResending(true);

    try {
      const response = await api.post(
        RESEND_OTP,
        { email }
      );

      setMessage(
        response.data?.message ||
          "If your account needs verification, an email will be sent."
      );

      setCooldown(60);
    } catch (err) {
      const status = err.response?.status;

      if (status === 429) {
        setError(
          "Please wait before requesting another verification code."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to resend the code. Please try again."
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-500/[0.08] blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-[110px]" />

      <section className="relative w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#0c1321] p-7 shadow-2xl sm:p-9">
        <Link href="/register" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-slate-950">
            T
          </span>
          <span className="text-xl font-bold">TradeFlow</span>
        </Link>

        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-3xl">
          ✉
        </div>

        <h1 className="mt-7 text-3xl font-semibold tracking-tight">
          Verify your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Enter the six-digit code we sent to{" "}
          <span className="break-all font-medium text-slate-200">
            {email || "your email address"}
          </span>
          .
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="mb-3 block text-sm font-medium text-slate-200"
            >
              Verification code
            </label>

            <input
              ref={inputRef}
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              className="w-full rounded-xl border border-slate-700 bg-[#070b14] px-4 py-4 text-center font-mono text-3xl tracking-[0.45em] outline-none transition placeholder:text-slate-700 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/[0.08] p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] p-3 text-sm text-emerald-300"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={verifying || otp.length !== 6 || !email}
            className="w-full rounded-xl bg-emerald-400 px-4 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Didnt receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0 || !email}
            className="mt-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend verification code"}
          </button>
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-5 text-center text-sm text-slate-500">
          <Link href="/login" className="hover:text-white">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}
