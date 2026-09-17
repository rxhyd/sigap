export type EdukasiSubtopicSlug =
  | "prevalensi"
  | "penyebab"
  | "faktor-risiko"
  | "dampak"
  | "upaya-penanggulangan";

export type EdukasiSubtopic = {
  slug: EdukasiSubtopicSlug;
  title: string;
  content: string[];
};

export type EdukasiCategorySlug = "kebakaran-hutan" | "gempa-bumi" | "tsunami" | "longsor";

export type EdukasiCategory = {
  slug: EdukasiCategorySlug;
  title: string;
  icon: "flame" | "activity" | "waves" | "mountain";
  subtopics: EdukasiSubtopic[];
};
