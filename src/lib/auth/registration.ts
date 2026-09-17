export const REGISTERED_COOKIE = "sigap_registered";

export function markRegisteredCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${REGISTERED_COOKIE}=1; path=/; max-age=31536000; samesite=lax`;
}

export function clearRegisteredCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${REGISTERED_COOKIE}=; path=/; max-age=0`;
}
