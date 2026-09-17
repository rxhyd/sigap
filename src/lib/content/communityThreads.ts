import type { CommunityThread } from "@/lib/types/community";

export const communityThreads: CommunityThread[] = [
  {
    id: "thread-1",
    author: "Fahmi",
    region: "Malang",
    message: "Adakah yang di Malang merasakan gempa? 😨",
    postedAt: "2026-09-16T10:15:00+07:00",
    viewCount: 1740,
    comments: [
      {
        id: "thread-1-c1",
        author: "Azzahra",
        region: "Malang",
        message: "Iya nih, aku lagi masak tiba tiba kerasa gerak sendiri gelasku.",
        postedAt: "2026-09-16T10:18:00+07:00",
      },
      {
        id: "thread-1-c2",
        author: "Anggun",
        region: "Pasuruan",
        message: "Pasuruan juga kerasa nih, ternyata kerasa hebat juga.",
        postedAt: "2026-09-16T10:22:00+07:00",
      },
    ],
  },
  {
    id: "thread-2",
    author: "Rian",
    region: "Pekanbaru",
    message: "Asapnya makin tebal dari kemarin, ada yang lain ngerasa sesak napas juga? 😷",
    postedAt: "2026-09-15T16:40:00+07:00",
    viewCount: 842,
    comments: [
      {
        id: "thread-2-c1",
        author: "Sari",
        region: "Dumai",
        message: "Iya di sini juga parah, anak-anak jadi susah napas. Udah pada pakai masker terus.",
        postedAt: "2026-09-15T17:05:00+07:00",
      },
    ],
  },
  {
    id: "thread-3",
    author: "Budi",
    region: "Cianjur",
    message: "Barusan berasa gempa kecil di Cianjur, ada yang ngerasain juga?",
    postedAt: "2026-09-14T21:10:00+07:00",
    viewCount: 356,
    comments: [
      {
        id: "thread-3-c1",
        author: "Wulan",
        region: "Sukabumi",
        message: "Kerasa dikit di sini, cuma goyang sebentar terus reda.",
        postedAt: "2026-09-14T21:30:00+07:00",
      },
    ],
  },
  {
    id: "thread-4",
    author: "Dimas",
    region: "Yogyakarta",
    message:
      "Ada yang punya rekomendasi jalur evakuasi kalau gempa di daerah Bantul? Rumah aku deket pantai selatan 🙏",
    postedAt: "2026-09-12T08:00:00+07:00",
    viewCount: 2100,
    comments: [
      {
        id: "thread-4-c1",
        author: "Nita",
        region: "Bantul",
        message: "Setahu aku titik kumpul terdekat di balai desa, tapi mending konfirmasi ke perangkat desa juga.",
        postedAt: "2026-09-12T09:15:00+07:00",
      },
    ],
  },
];
