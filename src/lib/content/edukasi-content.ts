import type { EdukasiCategory } from "@/lib/types/edukasi";

export const edukasiCategories: EdukasiCategory[] = [
  {
    slug: "kebakaran-hutan",
    title: "Kebakaran Hutan & Lahan",
    icon: "flame",
    mnemonic: {
      acronym: "ASAP",
      steps: [
        { letter: "A", title: "Amati", detail: "Pantau kualitas udara & peringatan." },
        {
          letter: "S",
          title: "Selamatkan",
          detail: "Lindungi anak, lansia, ibu hamil & penderita penyakit kronis.",
        },
        { letter: "A", title: "Atasi", detail: "Kurangi aktivitas di luar & hindari paparan asap." },
        {
          letter: "P",
          title: "Periksa",
          detail: "Kenali tanda bahaya dan segera ke fasilitas kesehatan bila sesak/nyeri dada.",
        },
      ],
      reminder: "Tidak terlihat ≠ tidak berbahaya.",
    },
    subtopics: [
      {
        slug: "prevalensi",
        title: "Prevalensi",
        content: [
          "Indonesia mencatat puluhan ribu titik panas (hotspot) setiap tahun, terutama pada musim kemarau (Juli-Oktober), dengan konsentrasi tertinggi di Sumatera dan Kalimantan.",
          "Pada tahun-tahun kemarau ekstrem (dipicu El Nino), luas area terbakar dapat mencapai lebih dari 1 juta hektare secara nasional.",
        ],
      },
      {
        slug: "penyebab",
        title: "Penyebab",
        content: [
          "Pembukaan lahan dengan cara membakar (land clearing) untuk perkebunan dan pertanian adalah penyebab dominan.",
          "Musim kemarau panjang dan kekeringan gambut membuat lahan sangat mudah terbakar dan sulit dipadamkan.",
          "Faktor manusia lain: puntung rokok, api unggun yang tidak dipadamkan, dan konflik lahan.",
        ],
      },
      {
        slug: "faktor-risiko",
        title: "Faktor Risiko",
        content: [
          "Masyarakat yang tinggal di sekitar lahan gambut dan area perkebunan berisiko tinggi terdampak asap.",
          "Kelompok rentan: balita, lansia, ibu hamil, dan penderita gangguan pernapasan (asma, ISPA) paling terdampak kabut asap.",
          "Petugas pemadam kebakaran hutan (Manggala Agni) menghadapi risiko fisik langsung dari api dan asap.",
        ],
      },
      {
        slug: "dampak",
        title: "Dampak",
        content: [
          "Kabut asap menurunkan kualitas udara secara drastis, memicu ISPA, iritasi mata, dan gangguan pernapasan kronis.",
          "Gangguan aktivitas: penutupan sekolah, penundaan penerbangan, dan penurunan aktivitas ekonomi di wilayah terdampak.",
          "Kerusakan ekosistem hutan, hilangnya habitat satwa, dan pelepasan emisi karbon dalam jumlah besar.",
        ],
      },
      {
        slug: "upaya-penanggulangan",
        title: "Upaya Penanggulangan",
        content: [
          "Pemantauan titik panas secara satelit (NASA FIRMS, BMKG) untuk deteksi dini dan respons cepat.",
          "Patroli terpadu dan penegakan hukum terhadap praktik pembakaran lahan ilegal.",
          "Restorasi lahan gambut (pembasahan kembali/rewetting) untuk mengurangi kerentanan terhadap kebakaran.",
          "Edukasi masyarakat tentang teknik pembukaan lahan tanpa bakar (PLTB).",
        ],
      },
    ],
  },
  {
    slug: "gempa-bumi",
    title: "Gempa Bumi",
    icon: "activity",
    mnemonic: {
      acronym: "LINDUNG",
      steps: [
        { letter: "L", title: "Lindungi kepala" },
        { letter: "I", title: "Ikuti prinsip Drop–Cover–Hold On" },
        { letter: "N", title: "Jangan panik" },
        { letter: "D", title: "Dahulukan keselamatan" },
        { letter: "U", title: "Usai gempa, evakuasi ke tempat aman" },
        { letter: "N", title: "Naik? Jangan gunakan lift" },
        { letter: "G", title: "Gunakan jalur evakuasi" },
      ],
      reminder: "Merunduk – Berlindung – Berpegangan.",
    },
    subtopics: [
      {
        slug: "prevalensi",
        title: "Prevalensi",
        content: [
          "Indonesia terletak di Cincin Api Pasifik (Ring of Fire) dan pertemuan 3 lempeng tektonik besar, sehingga mengalami ribuan gempa setiap tahun.",
          "BMKG mencatat rata-rata lebih dari 10.000 kali gempa per tahun di wilayah Indonesia, meski sebagian besar bermagnitudo kecil dan tidak dirasakan.",
        ],
      },
      {
        slug: "penyebab",
        title: "Penyebab",
        content: [
          "Pergerakan dan tumbukan lempeng tektonik (Indo-Australia, Eurasia, dan Pasifik) adalah penyebab utama gempa tektonik di Indonesia.",
          "Aktivitas sesar aktif di darat (sesar lokal) juga menjadi sumber gempa merusak meski magnitudonya lebih kecil.",
          "Aktivitas vulkanik dapat memicu gempa vulkanik di sekitar gunung berapi.",
        ],
      },
      {
        slug: "faktor-risiko",
        title: "Faktor Risiko",
        content: [
          "Penduduk yang tinggal di dekat garis pantai berisiko terdampak tsunami susulan setelah gempa besar.",
          "Bangunan yang tidak memenuhi standar tahan gempa meningkatkan risiko korban jiwa saat gempa kuat terjadi.",
          "Daerah dengan sesar aktif yang padat penduduk memiliki risiko kerugian yang lebih tinggi.",
        ],
      },
      {
        slug: "dampak",
        title: "Dampak",
        content: [
          "Kerusakan infrastruktur: bangunan roboh, jalan retak, jaringan listrik dan komunikasi terputus.",
          "Korban jiwa dan luka-luka, serta potensi tsunami untuk gempa besar dengan pusat di laut dangkal.",
          "Dampak psikologis jangka panjang (trauma) bagi penyintas, serta gangguan ekonomi di wilayah terdampak.",
        ],
      },
      {
        slug: "upaya-penanggulangan",
        title: "Upaya Penanggulangan",
        content: [
          "Upaya mandiri saat gempa terjadi: Drop – Cover – Hold On (Merunduk – Berlindung – Berpegangan), seperti pada gambar di bawah. Merunduk ke lantai, berlindung di bawah meja yang kokoh, lalu berpegangan pada kakinya sampai guncangan berhenti.",
          "Sistem peringatan dini tsunami (InaTEWS) oleh BMKG untuk gempa berpotensi tsunami.",
          "Penerapan standar bangunan tahan gempa dan retrofitting bangunan lama di zona rawan gempa.",
          "Simulasi dan edukasi kesiapsiagaan bencana (drill evakuasi) di sekolah dan komunitas.",
          "Rencana kontinjensi dan jalur evakuasi yang jelas di wilayah pesisir rawan tsunami.",
        ],
        image: {
          src: "https://www.gharpedia.com/cf-img/uploads/2016/05/Drop-Cover-Hold-Method-03-0207030006-1.jpg",
          alt: "Ilustrasi tiga langkah saat gempa: Drop (merunduk), Cover (berlindung di bawah meja), Hold On (berpegangan pada kaki meja)",
          width: 2000,
          height: 1080,
          caption: "Drop – Cover – Hold On: tiga langkah melindungi diri saat gempa berlangsung.",
          credit: "Gharpedia",
        },
      },
    ],
  },
  {
    slug: "tsunami",
    title: "Tsunami",
    icon: "waves",
    mnemonic: {
      acronym: "JAUH",
      steps: [
        { letter: "J", title: "Jauhi pantai setelah gempa kuat/lama." },
        { letter: "A", title: "Arahkan diri ke tempat tinggi atau titik evakuasi." },
        { letter: "U", title: "Utamakan kelompok rentan." },
        { letter: "H", title: "Hentikan keinginan melihat air laut." },
      ],
      reminder: "Gempa kuat/lama → segera evakuasi.",
    },
    subtopics: [
      {
        slug: "prevalensi",
        title: "Prevalensi",
        content: [
          "Indonesia adalah salah satu negara paling rawan tsunami di dunia karena posisinya di Cincin Api Pasifik dengan banyak zona subduksi di laut dalam.",
          "Sejak tahun 1600-an tercatat ratusan kejadian tsunami di Indonesia, dengan yang terbesar dalam sejarah modern adalah tsunami Aceh 2004 dan tsunami Selat Sunda 2018.",
          "Wilayah pesisir barat Sumatera, selatan Jawa, dan Nusa Tenggara termasuk zona dengan risiko tsunami tertinggi.",
        ],
      },
      {
        slug: "penyebab",
        title: "Penyebab",
        content: [
          "Gempa bumi tektonik dengan pusat di dasar laut dangkal (umumnya magnitudo besar) adalah penyebab utama, akibat pergeseran vertikal dasar laut.",
          "Letusan gunung berapi bawah laut atau di dekat pantai, seperti erupsi Anak Krakatau yang memicu tsunami Selat Sunda 2018.",
          "Longsoran bawah laut (submarine landslide) yang memindahkan volume air laut secara tiba-tiba.",
        ],
      },
      {
        slug: "faktor-risiko",
        title: "Faktor Risiko",
        content: [
          "Penduduk dan wisatawan di kawasan pesisir dengan elevasi rendah dan jarak dekat ke garis pantai paling berisiko.",
          "Minimnya rambu jalur evakuasi dan bangunan tinggi/shelter vertikal di beberapa daerah pesisir memperbesar risiko korban jiwa.",
          "Waktu tempuh gelombang yang sangat singkat (hitungan menit) untuk sumber gempa dekat pantai membuat waktu evakuasi sangat terbatas.",
        ],
      },
      {
        slug: "dampak",
        title: "Dampak",
        content: [
          "Gelombang tsunami dapat menyapu bersih permukiman, infrastruktur, dan lahan pertanian di wilayah pesisir dalam hitungan menit.",
          "Korban jiwa massal berpotensi terjadi jika peringatan dini tidak diterima atau evakuasi terlambat dilakukan.",
          "Intrusi air laut dapat merusak lahan pertanian dan sumber air bersih untuk jangka waktu lama pascakejadian.",
        ],
      },
      {
        slug: "upaya-penanggulangan",
        title: "Upaya Penanggulangan",
        content: [
          "Indonesia Tsunami Early Warning System (InaTEWS) oleh BMKG memantau gempa dan menerbitkan peringatan dini tsunami dalam hitungan menit.",
          "Sirine peringatan dini, rambu jalur evakuasi, dan shelter vertikal dibangun di kawasan pesisir rawan.",
          "Edukasi tanda-tanda alami tsunami (air laut surut drastis, gemuruh dari laut) agar warga bisa evakuasi mandiri tanpa menunggu sirine.",
          "Latihan evakuasi rutin (drill) di sekolah dan komunitas pesisir untuk mempercepat respons saat kejadian nyata.",
        ],
      },
    ],
  },
  {
    slug: "longsor",
    title: "Tanah Longsor",
    icon: "mountain",
    mnemonic: {
      acronym: "WASPADA",
      steps: [
        { letter: "W", title: "Waspadai hujan deras & lereng." },
        { letter: "A", title: "Amati retakan tanah atau bangunan." },
        { letter: "S", title: "Segera menjauh dari lereng bila ada tanda bahaya." },
        { letter: "P", title: "Pindah ke tempat aman." },
        { letter: "A", title: "Arahkan kelompok rentan untuk evakuasi." },
        { letter: "D", title: "Jangan kembali sebelum dinyatakan aman." },
        { letter: "A", title: "Awasi kemungkinan longsor susulan." },
      ],
    },
    subtopics: [
      {
        slug: "prevalensi",
        title: "Prevalensi",
        content: [
          "Tanah longsor adalah salah satu bencana paling sering terjadi di Indonesia, terutama pada musim hujan (Oktober-Maret).",
          "Wilayah dengan topografi perbukitan dan pegunungan seperti Jawa Barat, Jawa Tengah, dan Sumatera Barat mencatat kejadian longsor paling tinggi setiap tahun.",
        ],
      },
      {
        slug: "penyebab",
        title: "Penyebab",
        content: [
          "Curah hujan tinggi dan berkepanjangan yang menjenuhkan tanah lereng sehingga kehilangan daya ikat.",
          "Alih fungsi lahan (deforestasi, pemotongan lereng untuk permukiman/jalan) yang menghilangkan akar pepohonan penahan tanah.",
          "Kemiringan lereng yang curam dikombinasikan dengan jenis tanah gembur atau lapuk yang tidak stabil.",
        ],
      },
      {
        slug: "faktor-risiko",
        title: "Faktor Risiko",
        content: [
          "Permukiman yang dibangun di kaki atau puncak lereng curam serta di dekat tebing sangat rentan tertimbun material longsor.",
          "Daerah bekas tambang atau lahan yang telah gundul akibat penebangan liar memiliki risiko longsor yang meningkat drastis saat hujan deras.",
          "Anak-anak, lansia, dan penyandang disabilitas menghadapi risiko lebih tinggi karena keterbatasan mobilitas saat evakuasi mendadak.",
        ],
      },
      {
        slug: "dampak",
        title: "Dampak",
        content: [
          "Material longsor dapat menimbun rumah, jalan, dan lahan pertanian, menyebabkan korban jiwa dan kerugian materiil besar.",
          "Akses transportasi dan distribusi logistik ke daerah terisolasi sering terputus akibat longsor yang menutup jalan utama.",
          "Kerusakan lahan produktif dan perubahan bentang alam yang membutuhkan waktu lama untuk pulih.",
        ],
      },
      {
        slug: "upaya-penanggulangan",
        title: "Upaya Penanggulangan",
        content: [
          "Pemetaan zona rawan longsor oleh PVMBG/BNPB untuk membatasi permukiman di area berisiko tinggi.",
          "Penghijauan kembali (reboisasi) lereng dan terasering untuk memperkuat struktur tanah dan mengurangi erosi.",
          "Sistem peringatan dini berbasis curah hujan dan sensor pergerakan tanah di titik-titik rawan.",
          "Edukasi warga mengenali tanda-tanda awal longsor (retakan tanah, air rembesan tiba-tiba, pohon miring) untuk evakuasi dini.",
        ],
      },
    ],
  },
];
