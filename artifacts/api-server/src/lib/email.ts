import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "oralenetwork@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD ?? "",
  },
});

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  await transporter.sendMail({
    from: "Orale Network <oralenetwork@gmail.com>",
    to: "oralenetwork@gmail.com",
    subject: `New Contact Form Submission from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    html: `<p><strong>Name:</strong> ${data.name}</p>
<p><strong>Email:</strong> ${data.email}</p>
<p><strong>Message:</strong></p>
<p style="white-space:pre-wrap">${data.message}</p>`,
  });
}

export async function sendForSaleListingNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  await transporter.sendMail({
    from: "Orale Network <oralenetwork@gmail.com>",
    to: "onlinenetwork7767@gmail.com",
    subject: `New For Sale Listing from ${data.name}`,
    text: `From: ${data.name} (${data.email})\n\n${data.message}`,
    html: `<p><strong>From:</strong> ${data.name} (${data.email})</p><p style="white-space:pre-wrap">${data.message}</p>`,
  });
}

export async function sendBusinessSubmissionNotification(data: {
  contactName: string;
  email: string;
  businessName: string;
  city: string;
  description?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) return;
  await transporter.sendMail({
    from: "Orale Network <oralenetwork@gmail.com>",
    to: "oralenetwork@gmail.com",
    subject: `New Business Listing Request: ${data.businessName}`,
    text: `Business: ${data.businessName}\nCity: ${data.city}\nSubmitted by: ${data.contactName} (${data.email})\nPhone: ${data.phone ?? "N/A"}\nWebsite: ${data.websiteUrl ?? "N/A"}\n\nDescription:\n${data.description ?? ""}`,
    html: `<p><strong>Business:</strong> ${data.businessName}</p>
<p><strong>City:</strong> ${data.city}</p>
<p><strong>Submitted by:</strong> ${data.contactName} (${data.email})</p>
<p><strong>Phone:</strong> ${data.phone ?? "N/A"}</p>
<p><strong>Website:</strong> ${data.websiteUrl ?? "N/A"}</p>
<p><strong>Description:</strong></p>
<p style="white-space:pre-wrap">${data.description ?? ""}</p>`,
  });
}
