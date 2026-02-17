import { Resend } from 'resend';

const provider = process.env.MAIL_PROVIDER || 'resend';
const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

let resend: Resend | null = null;

if (provider === 'resend' && resendApiKey) {
  resend = new Resend(resendApiKey);
}

function validateMailConfig() {
  if (provider !== 'resend') {
    throw new Error('Unsupported mail provider. Use MAIL_PROVIDER=resend');
  }

  if (!resend) {
    throw new Error('RESEND_API_KEY is missing');
  }

  if (!contactToEmail) {
    throw new Error('CONTACT_TO_EMAIL is missing');
  }

  if (!contactFromEmail) {
    throw new Error('CONTACT_FROM_EMAIL is missing');
  }
}

export function isMailConfigured() {
  return Boolean(
    provider === 'resend' &&
      resendApiKey &&
      contactToEmail &&
      contactFromEmail
  );
}

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  message: string;
  messageId: string;
}) {
  validateMailConfig();

  const subject = `New portfolio contact from ${payload.name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Message ID:</strong> ${escapeHtml(payload.messageId)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
    </div>
  `;

  const text = [
    'New Contact Message',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Message ID: ${payload.messageId}`,
    '',
    payload.message,
  ].join('\n');

  await resend!.emails.send({
    from: contactFromEmail!,
    to: contactToEmail!,
    replyTo: payload.email,
    subject,
    html,
    text,
  });
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
