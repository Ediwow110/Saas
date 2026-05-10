export async function sendEmailReminder(params: { to: string; subject: string; html: string }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error("Email environment variables are not configured");
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: params.to }] }],
      from: { email: fromEmail },
      subject: params.subject,
      content: [{ type: "text/html", value: params.html }],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Email send failed: ${message}`);
  }
}
