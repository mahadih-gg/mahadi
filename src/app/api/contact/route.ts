import {
  isHoneypotTriggered,
  validateContactInput,
  type ContactApiResponse,
  type ContactInput,
} from "@/lib/contact-validation";
import { Resend } from "resend";

function jsonResponse(body: ContactApiResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let body: ContactInput;

  try {
    body = (await request.json()) as ContactInput;
  } catch {
    return jsonResponse(
      { success: false, error: "Invalid request body." },
      400,
    );
  }

  const validation = validateContactInput(body);
  if (!validation.ok) {
    return jsonResponse({ success: false, error: validation.error }, 400);
  }

  const { name, email, subject, message, website } = validation.data;

  if (isHoneypotTriggered(website)) {
    return jsonResponse({ success: true }, 200);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set.");
    return jsonResponse(
      {
        success: false,
        error: "Email service is not configured. Please try again later.",
      },
      503,
    );
  }

  const to = process.env.CONTACT_EMAIL ?? "mahadih.dev@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Mahadi Hasan <onboarding@resend.dev>";
  const timestamp = new Date().toISOString();

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    `Submitted: ${timestamp}`,
  ].join("\n");

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[Mahadi Hasan's Portfolio - Website Contact] ${subject}`,
      text,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return jsonResponse(
        { success: false, error: "Something went wrong. Please try again." },
        502,
      );
    }
  } catch (err) {
    console.error("[contact] Failed to send email:", err);
    return jsonResponse(
      { success: false, error: "Something went wrong. Please try again." },
      502,
    );
  }

  return jsonResponse({ success: true }, 200);
}
