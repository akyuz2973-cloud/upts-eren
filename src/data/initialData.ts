import {
  ProductLineRule,
  ProductionRecord,
  ShiftInfo,
  StationProductionRow,
  VortexMachineRule,
  ShowcaseSlide
} from '../types';

export const SHIFTS: ShiftInfo[] = [
  {
    code: 'A',
    name: '1. Vardiya (A)',
    hours: '08:00 - 16:00',
    supervisor: 'Ahmet Yılmaz',
    badgeColor: 'bg-amber-500/15 text-amber-800 border-amber-300'
  },
  {
    code: 'B',
    name: '2. Vardiya (B)',
    hours: '16:00 - 00:00',
    supervisor: 'Mehmet Demir',
    badgeColor: 'bg-blue-500/15 text-blue-800 border-blue-300'
  },
  {
    code: 'C',
    name: '3. Vardiya (C)',
    hours: '00:00 - 08:00',
    supervisor: 'Hasan Kaya',
    badgeColor: 'bg-emerald-500/15 text-emerald-800 border-emerald-300'
  }
];

export const INITIAL_PRODUCT_LINES: ProductLineRule[] = [
  {
    id: 'line-1',
    products: ['%100 VİSKON', '%50 PAMUK %50 POLYESTER'],
    line: 'KARIŞIM',
    beltColor: 'TURUNCU KUŞAK',
    sliverBagColor: 'KIRMIZI',
    wasteBagColor: 'BEYAZ',
    floorBagColor: 'BEYAZ'
  },
  {
    id: 'line-2',
    products: ['%100 VİSKON'],
    line: 'SENTETİK',
    beltColor: 'MAVİ KUŞAK',
    sliverBagColor: 'MAVİ',
    wasteBagColor: 'BEYAZ',
    floorBagColor: 'BEYAZ'
  }
];

export const INITIAL_VORTEX_MACHINES: VortexMachineRule[] = [
  { vortexNo: 1, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 2, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 3, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 4, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 5, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 6, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 7, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 8, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 9, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 10, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 11, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 12, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 13, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 14, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 15, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 16, product: '28/1  %50 PAMUK%50 PES', conicalColor: 'YEŞİL DAMA', bandageColor: 'TURUNCU' },
  { vortexNo: 17, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 18, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 19, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
  { vortexNo: 20, product: '28/1  %100 VİSKON', conicalColor: 'MAVİ TAÇ', bandageColor: 'MAVİ' },
];

export const INITIAL_STATION_PRODUCTION: StationProductionRow[] = [
  {
    shift: 'A',
    category: 'SENTETİK',
    tarak: 2874,
    cer1: 2737,
    cer2: 2837,
    cer3: 3371,
    vortex: 3686,
    paketleme: 8700,
    toplam: 471725,
  },
  {
    shift: 'A',
    category: 'KARIŞIM',
    tarak: 4710,
    cer1: 4587,
    cer2: 5135,
    cer3: 4384,
    vortex: 3416,
    paketleme: 8700,
    toplam: 471725,
  },
  {
    shift: 'B',
    category: 'SENTETİK',
    tarak: 3583,
    cer1: 4045,
    cer2: 3908,
    cer3: 3723,
    vortex: 4173,
    paketleme: 7200,
    toplam: 393574,
  },
  {
    shift: 'B',
    category: 'KARIŞIM',
    tarak: 3376,
    cer1: 3723,
    cer2: 5135,
    cer3: 4384,
    vortex: 2810,
    paketleme: 7200,
    toplam: 393574,
  },
  {
    shift: 'C',
    category: 'SENTETİK',
    tarak: 3689,
    cer1: 2503,
    cer2: 2825,
    cer3: 2779,
    vortex: 4101,
    paketleme: 9000,
    toplam: 372899,
  },
  {
    shift: 'C',
    category: 'KARIŞIM',
    tarak: 3200,
    cer1: 3076,
    cer2: 3875,
    cer3: 2976,
    vortex: 3085,
    paketleme: 9000,
    toplam: 372899,
  },
];

export const BRANDS = [
  'LACOSTE',
  'BURBERRY',
  'GANT',
  "Fash'Fed.",
  'House of SuperStep',
  'SuperStep',
  'SuperKIDS',
  'CONVERSE',
  'INTERSPORT',
  'HeartBeat',
  'NAUTICA',
  'occasion',
  'UTD4'
];

export const INITIAL_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'slide-1',
    title: 'Eren Tekstil & Global Markalar',
    subtitle: 'Dünya Standartlarında İplik Üretim Teknolojisi',
    type: 'brand',
  },
  {
    id: 'slide-2',
    title: 'Ürün Hat ve Çuval Renk Kodları',
    subtitle: 'Hat bazlı ayırt edici renk yönetimi ve telef tasnifi',
    type: 'product_line',
  },
  {
    id: 'slide-3',
    title: 'Vortex Makineleri (1 - 12)',
    subtitle: 'Konik Rengi & Bandaj Rengi Tanımları',
    type: 'vortex_1_12',
  },
  {
    id: 'slide-4',
    title: 'Vortex Makineleri (13 - 20)',
    subtitle: 'Konik Rengi & Bandaj Rengi Tanımları',
    type: 'vortex_13_20',
  },
  {
    id: 'slide-5',
    title: 'İstasyon Bazlı Vardiya Üretim Matrisi',
    subtitle: 'Tarak, Pasaj Cer, Vortex ve Paketleme Süreçleri',
    type: 'station_matrix',
  },
  {
    id: 'slide-6',
    title: 'Temmuz Ayı En Yüksek Üretim Yapan Vardiya',
    subtitle: 'Şampiyonluk İlanı: "Başarı ekip işidir."',
    type: 'champion_banner',
  },
];

// Generate 31 days of realistic production records matching user's totals
// Vardiya A: ~478.792 KG, Vardiya B: ~399.921 KG, Vardiya C: ~379.921 KG
export function generateInitialRecords(): ProductionRecord[] {
  const records: ProductionRecord[] = [];
  const daysInJuly = 31;

  // Base daily targets
  const targetA = 478792;
  const targetB = 399921;
  const targetC = 379921;

  // Base per day
  const avgA = targetA / daysInJuly;
  const avgB = targetB / daysInJuly;
  const avgC = targetC / daysInJuly;

  let sumA = 0;
  let sumB = 0;
  let sumC = 0;

  const operators = {
    A: ['Ahmet Yılmaz', 'Murat Kaya', 'Mustafa Çelik', 'Serkan Şahin'],
    B: ['Mehmet Demir', 'Ali Öztürk', 'Emre Aydın', 'Kemal Yıldız'],
    C: ['Hasan Kaya', 'Burak Aksoy', 'Volkan Doğan', 'Can Koç']
  };

  const yarnTypes = [
    '28/1 %50 PAMUK %50 PES',
    '28/1 %100 VİSKON',
    '30/1 KARIŞIM PENYE',
    '20/1 RING MELANJ'
  ];

  for (let day = 1; day <= daysInJuly; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-07-${dayStr}`;

    // pseudo-random oscillation based on sin
    const factorA = 0.94 + 0.12 * Math.sin(day * 1.3);
    const factorB = 0.93 + 0.14 * Math.sin(day * 1.7 + 1.2);
    const factorC = 0.92 + 0.15 * Math.sin(day * 1.5 + 2.5);

    let qtyA = Math.round(avgA * factorA);
    let qtyB = Math.round(avgB * factorB);
    let qtyC = Math.round(avgC * factorC);

    if (day === daysInJuly) {
      qtyA = targetA - sumA;
      qtyB = targetB - sumB;
      qtyC = targetC - sumC;
    } else {
      sumA += qtyA;
      sumB += qtyB;
      sumC += qtyC;
    }

    const wasteA = Math.round(qtyA * (0.014 + 0.004 * Math.sin(day * 0.9)));
    const wasteB = Math.round(qtyB * (0.016 + 0.005 * Math.cos(day * 1.1)));
    const wasteC = Math.round(qtyC * (0.018 + 0.006 * Math.sin(day * 0.7)));

    records.push({
      id: `rec-july-${day}-A`,
      date: dateStr,
      dayNumber: day,
      shift: 'A',
      yarnType: yarnTypes[(day + 0) % yarnTypes.length],
      station: 'VORTEX',
      quantityKg: qtyA,
      wasteKg: wasteA,
      operator: operators.A[day % operators.A.length],
      createdAt: `${dateStr}T16:05:00`,
      notes: day % 5 === 0 ? 'Yüksek randımanlı iplik çekimi tamamlandı' : ''
    });

    records.push({
      id: `rec-july-${day}-B`,
      date: dateStr,
      dayNumber: day,
      shift: 'B',
      yarnType: yarnTypes[(day + 1) % yarnTypes.length],
      station: 'VORTEX',
      quantityKg: qtyB,
      wasteKg: wasteB,
      operator: operators.B[day % operators.B.length],
      createdAt: `${dateStr}T23:55:00`,
      notes: ''
    });

    records.push({
      id: `rec-july-${day}-C`,
      date: dateStr,
      dayNumber: day,
      shift: 'C',
      yarnType: yarnTypes[(day + 2) % yarnTypes.length],
      station: 'VORTEX',
      quantityKg: qtyC,
      wasteKg: wasteC,
      operator: operators.C[day % operators.C.length],
      createdAt: `${dateStr}T07:50:00`,
      notes: ''
    });
  }

  return records;
}
