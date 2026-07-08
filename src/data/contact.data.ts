import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import type { IconType } from "react-icons/lib";

export type ContactLink = {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
};

export type ContactFormField = {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  multiline?: boolean;
};

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "mahadih.dev@gmail.com",
    href: "mailto:mahadih.dev@gmail.com",
    icon: HiOutlineEnvelope,
  },
  {
    label: "+8801856878150",
    href: "tel:+8801856878150",
    icon: HiOutlinePhone,
  },
  {
    label: "github.com/mahadih-gg",
    href: "https://github.com/mahadih-gg",
    icon: FaGithub,
    external: true,
  },
  {
    label: "linkedin.com/in/mahadih2",
    href: "https://linkedin.com/in/mahadih2",
    icon: FaLinkedin,
    external: true,
  },
];

export const CONTACT_FORM_FIELDS: ContactFormField[] = [
  {
    id: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address",
  },
  {
    id: "subject",
    label: "Subject",
    type: "text",
    placeholder: "How can I help?",
  },
  {
    id: "message",
    label: "Message",
    placeholder: "Tell me about your project...",
    multiline: true,
  },
];
