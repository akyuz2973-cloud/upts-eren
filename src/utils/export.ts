import { DailyShiftProduction, ProductionRecord } from '../types';

export function exportMonthlyMatrixToCSV(
  dailyData: DailyShiftProduction[],
  monthLabel: string,
  totalA: number,
  totalB: number,
  totalC: number,
  grandTotal: number
) {
  // UTF-8 BOM so Excel opens Turkish characters correctly
  let csvContent = '\uFEFF';
  csvContent += `Eren Tekstil - İplik Üretim Vardiya Matrisi (${monthLabel})\n`;
  csvContent += `Rapor Oluşturma Tarihi:;${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}\n\n`;

  // Header row
  csvContent += 'Gün;Tarih;1. Vardiya (A: 08:00-16:00) KG;A Fire (KG);2. Vardiya (B: 16:00-00:00) KG;B Fire (KG);3. Vardiya (C: 00:00-08:00) KG;C Fire (KG);Günlük Toplam (KG);Toplam Fire (KG);Lider Vardiya\n';

  dailyData.forEach((row) => {
    csvContent += [
      row.dayNumber,
      row.date,
      row.shiftA,
      row.wasteA,
      row.shiftB,
      row.wasteB,
      row.shiftC,
      row.wasteC,
      row.totalKg,
      row.totalWasteKg,
      `Vardiya ${row.topShift}`
    ].join(';') + '\n';
  });

  // Footer Totals row
  csvContent += `\nGENEL TOPLAM;;${totalA};${dailyData.reduce((s, r) => s + r.wasteA, 0)};${totalB};${dailyData.reduce((s, r) => s + r.wasteB, 0)};${totalC};${dailyData.reduce((s, r) => s + r.wasteC, 0)};${grandTotal};${dailyData.reduce((s, r) => s + r.totalWasteKg, 0)};Vardiya A (Şampiyon)\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Eren_Tekstil_Uretim_Matrisi_${monthLabel.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRecordsToCSV(records: ProductionRecord[]) {
  let csvContent = '\uFEFF';
  csvContent += 'ID;Tarih;Vardiya;İplik Cinsi;İstasyon;Üretilen Miktar (KG);Fire (KG);Operatör;Notlar\n';

  records.forEach((r) => {
    csvContent += [
      r.id,
      r.date,
      `Vardiya ${r.shift}`,
      `"${r.yarnType.replace(/"/g, '""')}"`,
      r.station || 'VORTEX',
      r.quantityKg,
      r.wasteKg,
      `"${r.operator.replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ].join(';') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Eren_Tekstil_Uretim_Kayitlari_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateTemplateCSV(): string {
  return `\uFEFFTarih;Vardiya;İplik Cinsi;İstasyon;Miktar (KG);Fire (KG);Operatör;Notlar
2026-07-01;A;28/1 %50 PAMUK %50 PES;VORTEX;15400;210;Ahmet Yılmaz;Sabah vardiyası
2026-07-01;B;28/1 %100 VİSKON;VORTEX;12900;190;Mehmet Demir;Akşam vardiyası
2026-07-01;C;30/1 KARIŞIM PENYE;VORTEX;12200;220;Hasan Kaya;Gece vardiyası`;
}

export function downloadTemplateCSV() {
  const content = generateTemplateCSV();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Eren_Tekstil_Ornek_Uretim_Sablonu.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
