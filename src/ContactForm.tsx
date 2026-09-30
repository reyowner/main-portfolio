import { useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const busy = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    for (const key of ["name", "email", "subject", "message"]) {
      const field = form.elements.namedItem(key) as
        HTMLInputElement | HTMLTextAreaElement;
      field.value = field.value.trim();
    }
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get("name")),
      email = String(values.get("email"));
    const subject = String(values.get("subject")),
      message = String(values.get("message"));
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => Array.from(part)[0])
      .join("")
      .toLocaleUpperCase();
    const time =
      new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date()) + " (Manila time)";
    busy.current = true;
    setStatus("sending");
    try {
      await emailjs.send(
        "service_1y4uagr",
        "template_sd87jyc",
        {
          name,
          from_name: name,
          email,
          from_email: email,
          reply_to: email,
          subject,
          title: subject,
          message,
          initials,
          time,
          to_name: "Renato Reoner Jr.",
        },
        {
          publicKey: "J1iypjLPkmIVIeREW",
          limitRate: { id: "portfolio-contact", throttle: 1000 },
        },
      );
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      busy.current = false;
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      aria-labelledby="form-title"
      aria-busy={status === "sending"}
    >
      <div className="letter-heading">
        <div>
          <span className="folio-eyebrow">Your message</span>
          <h3 id="form-title">What are you working on?</h3>
        </div>
        <span className="letter-stamp" aria-hidden="true">
          ↗
        </span>
      </div>
      <fieldset disabled={status === "sending"}>
        <div className="form-pair">
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              placeholder="Your full name"
              required
              maxLength={80}
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          What’s on your mind?
          <input
            name="subject"
            placeholder="A project, an opportunity, a hello…"
            required
            maxLength={160}
          />
        </label>
        <label>
          Your message
          <textarea
            name="message"
            rows={4}
            placeholder="Tell me a little about it."
            required
            maxLength={5000}
          />
        </label>
        <div className="form-trap" aria-hidden="true">
          <label>
            Leave this empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="form-bottom">
          <span>I’ll reply to the email you provide.</span>
          <button type="submit" className="primary-button">
            {status === "sending" ? "Sending…" : "Send message"}{" "}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </fieldset>
      <p
        className={`form-status status-${status}`}
        role="status"
        aria-live="polite"
      >
        {status === "sent"
          ? "Your note has been sent. Thank you for reaching out."
          : status === "error"
            ? "Your note couldn’t be sent. Please try again, or email me directly using the link beside this form."
            : ""}
      </p>
    </form>
  );
}
