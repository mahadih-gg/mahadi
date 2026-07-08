"use client";

import {
  validateContactInput,
  type ContactApiResponse,
  type ContactInput,
} from "@/lib/contact-validation";
import { useCallback, useState } from "react";

export type ContactFormStatus = "idle" | "loading" | "success" | "error";

interface UseContactFormOptions {
  onSuccess?: () => void;
}

export function useContactForm(options: UseContactFormOptions = {}) {
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (input: ContactInput) => {
      if (status === "loading") return;

      const validation = validateContactInput(input);
      if (!validation.ok) {
        setStatus("error");
        setError(validation.error);
        return;
      }

      setStatus("loading");
      setError(null);

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });

        const data = (await res.json()) as ContactApiResponse;

        if (!res.ok || !data.success) {
          setStatus("error");
          setError(data.error ?? "Something went wrong. Please try again.");
          return;
        }

        setStatus("success");
        options.onSuccess?.();
      } catch {
        setStatus("error");
        setError("Something went wrong. Please try again.");
      }
    },
    [status, options],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return {
    status,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    submit,
    reset,
  };
}
