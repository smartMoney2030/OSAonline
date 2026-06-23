const BASE = "/api";

function getToken() {
  return localStorage.getItem("orale_admin_token") ?? "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Too many requests — please wait a few minutes before trying again.");
    }
    const err = data.error;
    const msg = typeof err === "string" ? err : `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// ---- Events ----

export interface Event {
  id: number;
  title: string;
  subtitle: string;
  dateStr: string;
  locationName: string;
  locationAddress: string;
  organizer: string;
  imageUrl: string;
  ticketUrl: string;
  status: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type EventPayload = Omit<Event, "id" | "createdAt">;

export async function getAdminEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE}/admin/events`, { headers: authHeaders() });
  return handleResponse<Event[]>(res);
}

export async function getPublicEvents(): Promise<Event[]> {
  const res = await fetch(`${BASE}/events`);
  return handleResponse<Event[]>(res);
}

export async function createEvent(data: EventPayload): Promise<Event> {
  const res = await fetch(`${BASE}/admin/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Event>(res);
}

export async function updateEvent(id: number, data: Partial<EventPayload>): Promise<Event> {
  const res = await fetch(`${BASE}/admin/events/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Event>(res);
}

export async function deleteEvent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/admin/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// ---- Businesses ----

export interface Business {
  id: number;
  city: string;
  name: string;
  badge: string | null;
  description: string;
  phone: string | null;
  websiteUrl: string | null;
  websiteLabel: string | null;
  youtubeUrl: string | null;
  imageUrl: string | null;
  commercialUrl: string | null;
  isComingSoon: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type BusinessPayload = Omit<Business, "id" | "createdAt">;

export async function getAdminBusinesses(): Promise<Business[]> {
  const res = await fetch(`${BASE}/admin/businesses`, { headers: authHeaders() });
  return handleResponse<Business[]>(res);
}

export async function getPublicBusinesses(): Promise<Business[]> {
  const res = await fetch(`${BASE}/businesses`);
  return handleResponse<Business[]>(res);
}

export async function createBusiness(data: BusinessPayload): Promise<Business> {
  const res = await fetch(`${BASE}/admin/businesses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Business>(res);
}

export async function updateBusiness(id: number, data: Partial<BusinessPayload>): Promise<Business> {
  const res = await fetch(`${BASE}/admin/businesses/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Business>(res);
}

export async function deleteBusiness(id: number): Promise<void> {
  const res = await fetch(`${BASE}/admin/businesses/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// ---- Business Listing Requests ----

export interface BusinessSubmission {
  id: number;
  businessName: string;
  city: string;
  contactName: string;
  phone: string;
  email: string;
  websiteUrl: string | null;
  description: string | null;
  status: string;
  createdAt: string;
}

export type BusinessSubmissionPayload = Omit<BusinessSubmission, "id" | "createdAt" | "status">;

export async function getBusinessSubmissions(): Promise<BusinessSubmission[]> {
  const res = await fetch(`${BASE}/admin/business-submissions`, { headers: authHeaders() });
  return handleResponse<BusinessSubmission[]>(res);
}

export async function updateBusinessSubmissionStatus(
  id: number,
  status: "pending" | "approved" | "rejected",
): Promise<BusinessSubmission> {
  const res = await fetch(`${BASE}/admin/business-submissions/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<BusinessSubmission>(res);
}

export async function submitBusinessListing(data: BusinessSubmissionPayload): Promise<BusinessSubmission> {
  const res = await fetch(`${BASE}/businesses/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<BusinessSubmission>(res);
}

// ---- Contact Submissions ----

export interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  message?: string | null;
  createdAt: string;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const res = await fetch(`${BASE}/admin/contact-submissions`, { headers: authHeaders() });
  return handleResponse<ContactSubmission[]>(res);
}

export async function deleteContactSubmission(id: number): Promise<void> {
  const res = await fetch(`${BASE}/admin/contact-submissions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

// ---- Properties (For Sale by Owner) ----

export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  price: string;
  bedrooms: number | null;
  bathrooms: string | null;
  sqft: number | null;
  lotSize: string | null;
  propertyType: string;
  yearBuilt: number | null;
  garage: string | null;
  description: string;
  images: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  status: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export type PropertyPayload = Omit<Property, "id" | "createdAt">;

export async function getPublicProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE}/properties`);
  return handleResponse<Property[]>(res);
}

export async function getAdminProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE}/admin/properties`, { headers: authHeaders() });
  return handleResponse<Property[]>(res);
}

export async function createProperty(data: PropertyPayload): Promise<Property> {
  const res = await fetch(`${BASE}/admin/properties`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Property>(res);
}

export async function updateProperty(id: number, data: Partial<PropertyPayload>): Promise<Property> {
  const res = await fetch(`${BASE}/admin/properties/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Property>(res);
}

export async function deleteProperty(id: number): Promise<void> {
  const res = await fetch(`${BASE}/admin/properties/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handleResponse<unknown>(res);
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  const res = await fetch(`${BASE}/admin/upload-multiple`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await handleResponse<{ urls: string[] }>(res);
  return data.urls;
}

// ---- About Us ----

export interface AboutUsService {
  num: string;
  title: string;
  desc: string;
}

export interface AboutUsContent {
  headline: string;
  headlineItalic: string;
  intro1: string;
  intro2: string;
  mission: string;
  missionSub: string;
  services: AboutUsService[];
}

export async function getAboutUs(): Promise<AboutUsContent> {
  const res = await fetch(`${BASE}/about-us`);
  return handleResponse<AboutUsContent>(res);
}

export async function updateAboutUs(data: AboutUsContent): Promise<AboutUsContent> {
  const res = await fetch(`${BASE}/admin/about-us`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<AboutUsContent>(res);
}

export interface ForSaleSubmissionPayload {
  name: string;
  email: string;
  phone: string;
  category: string;
  title: string;
  price: string;
  city: string;
  description: string;
}

export async function submitForSaleListing(data: ForSaleSubmissionPayload): Promise<void> {
  const message = [
    `FOR SALE SUBMISSION`,
    `---`,
    `Item: ${data.title}`,
    `Category: ${data.category}`,
    `Asking Price: ${data.price}`,
    `City: ${data.city}`,
    `Phone: ${data.phone}`,
    `---`,
    `Description: ${data.description}`,
  ].join("\n");

  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, message }),
  });
  await handleResponse<{ success: boolean }>(res);
}
