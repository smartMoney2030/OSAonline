import { ReplitConnectors } from "@replit/connectors-sdk";
import type { PayingForwardApplication } from "@workspace/db";

// Obtain fresh connector authorization for every request; never cache an OAuth client.
export async function sendPayingForwardEmail(application: PayingForwardApplication) {
  const connectors = new ReplitConnectors();
  const profile = await connectors.proxy("google-mail", "/gmail/v1/users/me/profile", { method: "GET" });
  if (!profile.ok) throw new Error(`Email provider returned status ${profile.status}`);
  const { emailAddress } = await profile.json() as { emailAddress?: string };
  if (!emailAddress || !/^[^@\s<>]+@[^@\s<>]+$/.test(emailAddress)) {
    throw new Error("Connected Gmail account has no valid sending address");
  }
  // Read back before a retry: delivery may have succeeded even if the prior response was lost.
  const messageId = `paying-forward-${application.id}-${application.createdAt.getTime()}@oraleonline.com`;
  const sent = await connectors.proxy("google-mail",
    `/gmail/v1/users/me/messages?q=${encodeURIComponent(`in:sent rfc822msgid:${messageId}`)}&maxResults=1`,
    { method: "GET" });
  if (!sent.ok) throw new Error(`Email provider returned status ${sent.status}`);
  const previous = await sent.json() as { messages?: { id: string }[] };
  if (previous.messages?.length) return;
  const subject = `Paying Forward Application: ${application.businessName}`.replace(/[\r\n]/g, " ");
  const text = [
    `Application #${application.id}`,
    `Name of your business: ${application.businessName}`,
    `Owner of Business: ${application.ownerName}`,
    `Direct contact number: ${application.phone}`,
    `Do you have a website? ${application.hasWebsite ? "Yes" : "No — interested in website assistance"}`,
    `Website: ${application.websiteUrl || "None"}`,
    `Services you offer: ${application.services}`,
    `Address: ${application.address}`,
    `City: ${application.city}`,
    `State: ${application.state}`,
    `ZIP code: ${application.zipCode}`,
    `Additional Comment: ${application.comments || "None"}`,
    `Submitted: ${application.createdAt.toISOString()}`,
  ].join("\n\n");
  const raw = [
    `From: Orale Network <${emailAddress}>`,
    "To: onlinenetwork7767@gmail.com",
    `Message-ID: <${messageId}>`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(text).toString("base64").match(/.{1,76}/g)!.join("\r\n"),
  ].join("\r\n");
  const response = await connectors.proxy("google-mail", "/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw: Buffer.from(raw).toString("base64url") }),
  });
  if (!response.ok) throw new Error(`Email provider returned status ${response.status}`);
}
