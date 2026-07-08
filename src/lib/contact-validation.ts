export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface ContactApiResponse {
  success: boolean;
  error?: string;
}

const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;

type ValidationResult =
  | { ok: true; data: ContactInput }
  | { ok: false; error: string };

export function validateContactInput(raw: ContactInput): ValidationResult {
  const name = raw.name.trim();
  const email = raw.email.trim();
  const subject = raw.subject.trim();
  const message = raw.message.trim();
  const website = (raw.website ?? "").trim();

  if (!name) {
    return { ok: false, error: "Please enter your full name." };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "Name must be 100 characters or fewer." };
  }
  if (!email) {
    return { ok: false, error: "Please enter your email address." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!subject) {
    return { ok: false, error: "Please enter a subject." };
  }
  if (subject.length > MAX_SUBJECT_LENGTH) {
    return { ok: false, error: "Subject must be 200 characters or fewer." };
  }
  if (!message) {
    return { ok: false, error: "Please enter a message." };
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`,
    };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Message must be 5000 characters or fewer." };
  }

  return {
    ok: true,
    data: { name, email, subject, message, website },
  };
}

export function isHoneypotTriggered(website?: string): boolean {
  return Boolean(website?.trim());
}
