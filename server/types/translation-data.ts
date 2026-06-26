/** Structure of the backend-relevant portion of an i18n JSON translation file. */
export interface TranslationData {
  backend: {
    schedule: {
      summary: string;
    };
    email: {
      schedule: {
        heading: string;
        greeting: string;
        detailsHeading: string;
        dateLabel: string;
        meetLabel: string;
        problemQuestion: string;
        rescheduleText: string;
        ctaLabel: string;
      };
    };
  };
  [key: string]: unknown;
}
