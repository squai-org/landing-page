export type Lang = "en" | "es";

export type Localized<T = string> = Record<Lang, T>;
