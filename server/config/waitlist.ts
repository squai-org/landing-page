const WAITLIST_FORM_ID = "1FAIpQLSfkqp1KPbGs0s_CbfxUXtcBJ_EeXaAX6jN72p9zl5DdyFx4_w";

export const WAITLIST_EMAIL_ENTRY = "entry.959119065";

export const WAITLIST_AGE_ENTRIES: Record<number, string> = {
  0: "entry.1357549478",
  2: "entry.620766608",
  3: "entry.736494075",
  4: "entry.1978712710",
  5: "entry.1130069399",
  6: "entry.330002294",
  7: "entry.1445115171",
  8: "entry.1846774649",
  9: "entry.1351211842",
  12: "entry.160831217",
};

export const MAX_CHILD_AGES = 10;

export function getWaitlistFormActionUrl(): string {
  return `https://docs.google.com/forms/d/e/${WAITLIST_FORM_ID}/formResponse`;
}
