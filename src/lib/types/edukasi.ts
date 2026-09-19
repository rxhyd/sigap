export type EdukasiSubtopicSlug =
  | "prevalensi"
  | "penyebab"
  | "faktor-risiko"
  | "dampak"
  | "upaya-penanggulangan";

export type EdukasiImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
};

export type EdukasiSubtopic = {
  slug: EdukasiSubtopicSlug;
  title: string;
  content: string[];
  image?: EdukasiImage;
};

export type MnemonicStep = {
  letter: string;
  title: string;
  detail?: string;
};

export type EdukasiMnemonic = {
  acronym: string;
  steps: MnemonicStep[];
  reminder?: string;
};

export type EdukasiCategorySlug = "kebakaran-hutan" | "gempa-bumi" | "tsunami" | "longsor";

export type EdukasiCategory = {
  slug: EdukasiCategorySlug;
  title: string;
  icon: "flame" | "activity" | "waves" | "mountain";
  mnemonic: EdukasiMnemonic;
  subtopics: EdukasiSubtopic[];
};
