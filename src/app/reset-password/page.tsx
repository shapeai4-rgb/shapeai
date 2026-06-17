"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { locale, messages } = useI18n();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const copy = {
    en: {
      title: "Reset your password",
      lead: "Enter a new password for your ShapeAI account.",
      password: "New password",
      confirm: "Confirm password",
      submit: "Update password",
      loading: "Updating...",
      success: "Your password has been updated. You can now log in.",
      invalidLink: "This reset link is missing or invalid.",
      mismatch: "Passwords do not match.",
      weak: "Password must be at least 8 characters.",
      failed: "Reset link is invalid or expired.",
      login: "Back to login",
    },
    es: {
      title: "Restablece tu contraseña",
      lead: "Introduce una nueva contraseña para tu cuenta de ShapeAI.",
      password: "Nueva contraseña",
      confirm: "Confirmar contraseña",
      submit: "Actualizar contraseña",
      loading: "Actualizando...",
      success: "Tu contraseña se ha actualizado. Ya puedes iniciar sesión.",
      invalidLink: "Este enlace no existe o no es válido.",
      mismatch: "Las contraseñas no coinciden.",
      weak: "La contraseña debe tener al menos 8 caracteres.",
      failed: "El enlace no es válido o ha caducado.",
      login: "Volver al inicio de sesión",
    },
    de: {
      title: "Passwort zurücksetzen",
      lead: "Gib ein neues Passwort für dein ShapeAI-Konto ein.",
      password: "Neues Passwort",
      confirm: "Passwort bestätigen",
      submit: "Passwort aktualisieren",
      loading: "Wird aktualisiert...",
      success: "Dein Passwort wurde aktualisiert. Du kannst dich jetzt anmelden.",
      invalidLink: "Dieser Link fehlt oder ist ungültig.",
      mismatch: "Passwörter stimmen nicht überein.",
      weak: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      failed: "Der Link ist ungültig oder abgelaufen.",
      login: "Zurück zum Login",
    },
  }[locale];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setError(copy.invalidLink);
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setError(copy.weak);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setError(copy.mismatch);
      return;
    }

    setStatus("loading");
    setError("");

    const response = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, token }),
    });

    if (!response.ok) {
      setStatus("error");
      setError(copy.failed);
      return;
    }

    setStatus("success");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12">
      <form onSubmit={submit} className="w-full rounded-3xl border border-neutral-lines bg-white p-6 shadow-soft md:p-8">
        <h1 className="font-headings text-2xl font-semibold text-neutral-ink">{copy.title}</h1>
        <p className="mt-2 text-sm text-neutral-slate">{copy.lead}</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-slate">{copy.password}</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-slate">{copy.confirm}</label>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-neutral-lines px-3 py-2 outline-none ring-accent/50 focus:ring-2"
            />
          </div>
        </div>

        {status === "error" && <p className="mt-4 rounded-lg bg-status-danger/10 p-3 text-sm text-status-danger">{error}</p>}
        {status === "success" && <p className="mt-4 rounded-lg bg-accent/10 p-3 text-sm text-accent">{copy.success}</p>}

        <Button type="submit" disabled={status === "loading" || status === "success"} className="mt-6 w-full">
          {status === "loading" ? copy.loading : copy.submit}
        </Button>

        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-accent hover:underline">
          {status === "success" ? copy.login : messages.common.back}
        </Link>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
