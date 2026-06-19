import { WAITLIST_EMAIL_ENTRY, WAITLIST_AGE_ENTRIES, getWaitlistFormActionUrl } from "../config/waitlist.js";

export async function submitWaitlistToGoogleForm(email: string, childAges: number[]): Promise<void> {
  const params = new URLSearchParams();
  params.set(WAITLIST_EMAIL_ENTRY, email);
  for (const age of childAges) {
    params.set(WAITLIST_AGE_ENTRIES[age], String(age));
  }

  const response = await fetch(getWaitlistFormActionUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Google Form submission failed with status ${response.status}`);
  }
}
