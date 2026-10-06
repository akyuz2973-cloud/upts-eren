export type ShiftCode = 'A' | 'B' | 'C';

export interface ShiftInfo {
  code: ShiftCode;
  name: string;
  hours: string;
  supervisor: string;
  badgeColor: string;
}

export interface ProductionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31
  shift: ShiftCode;
  yarnType: string;
  station: string;
  quantityKg: number;
  wasteKg: number;
  operator: string;
  notes?: string;
  createdAt: string;
}

export interface DailyShiftProduction {
  date: string;
  dayNumber: number;
  shiftA: number;
  shiftB: number;
  shiftC: number;
  wasteA: number;
  wasteB: number;
  wasteC: number;
  totalKg: number;
  totalWasteKg: number;
  topShift: ShiftCode;
}

export interface ProductLineRule {
  id: string;
  products: string[];
  line: string; // "KARIŞIM" | "SENTETİK"
  beltColor: string; // "TURUNCU KUŞAK" | "MAVİ KUŞAK"
  sliverBagColor: string; // "KIRMIZI" | "MAVİ"
  wasteBagColor: string; // "BEYAZ"
  floorBagColor: string; // "BEYAZ"
}

export interface VortexMachineRule {
  vortexNo: number;
  product: string;
  conicalColor: string;
  bandageColor: string;
}

export interface StationProductionRow {
  shift: ShiftCode;
  category: 'SENTETİK' | 'KARIŞIM';
  tarak: number;
  cer1: number;
  cer2: number;
  cer3: number;
  vortex: number;
  paketleme: number;
  toplam: number;
}

export interface ShowcaseSlide {
  id: string;
  title: string;
  type: 'brand' | 'product_line' | 'vortex_1_12' | 'vortex_13_20' | 'station_matrix' | 'champion_banner' | 'custom_image';
  subtitle?: string;
  customImageUrl?: string;
}
