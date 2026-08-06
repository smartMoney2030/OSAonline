import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

const DEFAULT_TITLE = "Órale Network — Premier Business Consulting & Multimedia Streaming";
const DEFAULT_DESCRIPTION =
  "Órale Network: elite business consulting, multimedia streaming TV and radio, community events, and for-sale listings serving San Antonio, Texas and beyond.";

function setMeta(name: string, content: string) {
  let el =
    document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`) ??
    document.querySelector<HTMLMetaElement>(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:") || name.startsWith("twitter:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function usePageMeta({ title, description, canonical, ogImage }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} | Órale Network`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const canon = canonical ?? window.location.href;

    document.title = fullTitle;

    setMeta("description", desc);
    setLink("canonical", canon);

    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:url", canon);
    if (ogImage) setMeta("og:image", ogImage);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    if (ogImage) setMeta("twitter:image", ogImage);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
      setMeta("og:title", DEFAULT_TITLE);
      setMeta("og:description", DEFAULT_DESCRIPTION);
    };
  }, [title, description, canonical, ogImage]);
}
