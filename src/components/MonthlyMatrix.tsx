import React, { useState } from 'react';
import {
  DailyShiftProduction,
  ProductionRecord,
  ShiftCode
} from '../types';
import {
  Download,
  Printer,
  Search,
  Filter,
  Eye,
  Edit2,
  Trophy,
  ChevronRight,
  Plus
} from 'lucide-react';
import { exportMonthlyMatrixToCSV } from '../utils/export';

interface MonthlyMatrixProps {
  dailyData: DailyShiftProduction[];
  records: ProductionRecord[];
  monthLabel: string;
  totalA: number;
  totalB: number;
  totalC: number;
  grandTotal: number;
  onEditDayRecord?: (record: ProductionRecord) => void;
  onAddNewForDate?: (date: string, shift: ShiftCode) => void;
}

export const MonthlyMatrix: React.FC<MonthlyMatrixProps> = ({
  dailyData,
  records,
  monthLabel,
  totalA,
  totalB,
  totalC,
  grandTotal,
  onEditDayRecord,
  onAddNewForDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [selectedDayDetails, setSelectedDayDetails] = useState<DailyShiftProduction | null>(null);

  // Filter rows
  const filteredData = dailyData.filter((row) => {
    const matchesSearch =
      row.dayNumber.toString().includes(searchTerm) ||
      row.date.includes(searchTerm);
    if (!matchesSearch) return false;
    if (selectedShiftFilter === 'all') return true;
    return row.topShift === selectedShiftFilter;
  });

  const totalWasteA = dailyData.reduce((acc, r) => acc + r.wasteA, 0);
  const totalWasteB = dailyData.reduce((acc, r) => acc + r.wasteB, 0);
  const totalWasteC = dailyData.reduce((acc, r) => acc + r.wasteC, 0);
  const grandTotalWaste = totalWasteA + totalWasteB + totalWasteC;

  const handleExportCSV = () => {
    exportMonthlyMatrixToCSV(dailyData, monthLabel, totalA, totalB, totalC, grandTotal);
  };

  const handlePrint = () => {
    window.print();
  };

  const dayRecords = selectedDayDetails
    ? records.filter((r) => r.date === selectedDayDetails.date)
    : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Aylık Vardiya Üretim Matrisi</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
              {monthLabel}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Günlük vardiya üretim miktarları, fire oranları ve genel toplam analizi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Shift filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedShiftFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedShiftFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Günler
            </button>
            <button
              onClick={() => setSelectedShiftFilter('A')}
              className={`px-2 py-1 rounded-md transition-colors ${
                selectedShiftFilter === 'A'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lider A
            </button>
            <button
              onClick={() => setSelectedShiftFilter('B')}
              className={`px-2 py-1 rounded-md transition-colors ${
                selectedShiftFilter === 'B'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lider B
            </button>
            <button
              onClick={() => setSelectedShiftFilter('C')}
              className={`px-2 py-1 rounded-md transition-colors ${
                selectedShiftFilter === 'C'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lider C
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Gün ara (örn: 15)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 sm:w-40"
            />
          </div>

          {/* Action Export Buttons */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Excel uyumlu CSV indir"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="PDF olarak kaydet veya yazdır"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">PDF / Yazdır</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div id="monthly-matrix-scroll-container" className="overflow-x-auto scroll-smooth">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-100/90 sticky top-0 z-20 text-slate-700 border-b border-slate-200 backdrop-blur-xs">
            <tr>
              <th className="py-3 px-3 font-bold w-14 text-center">GÜN</th>
              <th className="py-3 px-3 font-bold w-28">TARİH</th>
              <th className="py-3 px-4 font-bold text-amber-900 bg-amber-50/70 border-x border-amber-200/60">
                <div className="flex items-center justify-between">
                  <span>1. VARDİYA (A)</span>
                  <span className="text-[10px] font-normal text-amber-700">08:00 - 16:00</span>
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-blue-900 bg-blue-50/70 border-r border-blue-200/60">
                <div className="flex items-center justify-between">
                  <span>2. VARDİYA (B)</span>
                  <span className="text-[10px] font-normal text-blue-700">16:00 - 00:00</span>
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-emerald-900 bg-emerald-50/70 border-r border-emerald-200/60">
                <div className="flex items-center justify-between">
                  <span>3. VARDİYA (C)</span>
                  <span className="text-[10px] font-normal text-emerald-700">00:00 - 08:00</span>
                </div>
              </th>
              <th className="py-3 px-4 font-bold text-slate-900 bg-slate-200/60 text-right">
                GÜNLÜK TOPLAM (KG)
              </th>
              <th className="py-3 px-3 font-bold text-center w-20">LİDER</th>
              <th className="py-3 px-2 text-center w-12 print:hidden">İŞLEM</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 font-mono">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                  Aramanıza uygun üretim kaydı bulunamadı.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => {
                const isSelected = selectedDayDetails?.date === row.date;
                return (
                  <tr
                    key={row.date}
                    onClick={() => setSelectedDayDetails(row)}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 font-medium' : ''
                    }`}
                  >
                    {/* Gün No */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600 bg-slate-50/50">
                      {row.dayNumber}. Gün
                    </td>

                    {/* Tarih */}
                    <td className="py-2.5 px-3 font-sans text-slate-600 whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Vardiya A */}
                    <td className="py-2.5 px-4 bg-amber-50/20 border-x border-amber-100/60">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 tabular-nums text-sm">
                          {row.shiftA.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">KG</span>
                        </span>
                        <span className="text-[10px] text-rose-500 font-normal">
                          -{row.wasteA} fire
                        </span>
                      </div>
                    </td>

                    {/* Vardiya B */}
                    <td className="py-2.5 px-4 bg-blue-50/20 border-r border-blue-100/60">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 tabular-nums text-sm">
                          {row.shiftB.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">KG</span>
                        </span>
                        <span className="text-[10px] text-rose-500 font-normal">
                          -{row.wasteB} fire
                        </span>
                      </div>
                    </td>

                    {/* Vardiya C */}
                    <td className="py-2.5 px-4 bg-emerald-50/20 border-r border-emerald-100/60">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 tabular-nums text-sm">
                          {row.shiftC.toLocaleString('tr-TR')} <span className="text-[10px] font-normal text-slate-500">KG</span>
                        </span>
                        <span className="text-[10px] text-rose-500 font-normal">
                          -{row.wasteC} fire
                        </span>
                      </div>
                    </td>

                    {/* Günlük Toplam */}
                    <td className="py-2.5 px-4 text-right bg-slate-50/50">
                      <span className="font-bold text-slate-900 tabular-nums text-sm">
                        {row.totalKg.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 ml-1">KG</span>
                    </td>

                    {/* Günün Lider Vardiyası */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-sans ${
                          row.topShift === 'A'
                            ? 'bg-amber-100 text-amber-800'
                            : row.topShift === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {row.topShift === 'A' && <Trophy className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />}
                        Vardiya {row.topShift}
                      </span>
                    </td>

                    {/* İncele Butonu */}
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDayDetails(row);
                        }}
                        className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors"
                        title="Günlük detayları görüntüle"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* User Required: En altta genel alt toplam satırı */}
          <tfoot className="bg-slate-900 text-white font-mono sticky bottom-0 z-20 shadow-md">
            <tr>
              <td colSpan={2} className="py-3 px-4 font-bold font-sans uppercase tracking-wider text-xs bg-slate-950">
                GENEL ALT TOPLAM (AY BOYUNCA)
              </td>

              {/* Vardiya A Ay Toplamı */}
              <td className="py-3 px-4 bg-amber-950/70 border-x border-amber-800/60">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-extrabold text-amber-300">
                      {totalA.toLocaleString('tr-TR')} KG
                    </span>
                    <span className="text-[10px] text-amber-400 font-sans font-bold px-1.5 py-0.5 bg-amber-900/60 rounded">
                      🏆 LİDER
                    </span>
                  </div>
                  <span className="text-[10px] text-rose-300">
                    Toplam Fire: {totalWasteA.toLocaleString('tr-TR')} KG
                  </span>
                </div>
              </td>

              {/* Vardiya B Ay Toplamı */}
              <td className="py-3 px-4 bg-blue-950/70 border-r border-blue-800/60">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-extrabold text-blue-300">
                    {totalB.toLocaleString('tr-TR')} KG
                  </span>
                  <span className="text-[10px] text-rose-300">
                    Toplam Fire: {totalWasteB.toLocaleString('tr-TR')} KG
                  </span>
                </div>
              </td>

              {/* Vardiya C Ay Toplamı */}
              <td className="py-3 px-4 bg-emerald-950/70 border-r border-emerald-800/60">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-extrabold text-emerald-300">
                    {totalC.toLocaleString('tr-TR')} KG
                  </span>
                  <span className="text-[10px] text-rose-300">
                    Toplam Fire: {totalWasteC.toLocaleString('tr-TR')} KG
                  </span>
                </div>
              </td>

              {/* Genel Ay Toplamı */}
              <td className="py-3 px-4 text-right bg-slate-950">
                <div className="flex flex-col items-end">
                  <span className="text-base sm:text-lg font-black text-white">
                    {grandTotal.toLocaleString('tr-TR')} KG
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Net: {(grandTotal - grandTotalWaste).toLocaleString('tr-TR')} KG
                  </span>
                </div>
              </td>

              <td colSpan={2} className="py-3 px-3 text-center bg-slate-950">
                <span className="text-xs font-sans text-amber-400 font-semibold flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Şampiyon A</span>
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Selected Day Drill-down Drawer / Detail Panel */}
      {selectedDayDetails && (
        <div className="p-4 sm:p-5 bg-blue-50/50 border-t border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {selectedDayDetails.dayNumber}. Gün Detay Kayıtları ({selectedDayDetails.date})
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Günün Toplamı: {selectedDayDetails.totalKg.toLocaleString('tr-TR')} KG
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Bu tarihe ait girilmiş olan tekil vardiya kayıtları aşağıda listelenmiştir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onAddNewForDate && (
              <button
                onClick={() => onAddNewForDate(selectedDayDetails.date, 'A')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bu Güne Kayıt Ekle</span>
              </button>
            )}
            <button
              onClick={() => setSelectedDayDetails(null)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
            >
              Paneli Kapat
            </button>
          </div>
        </div>
      )}

      {selectedDayDetails && dayRecords.length > 0 && (
        <div className="px-5 pb-5 pt-1 bg-blue-50/30 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dayRecords.map((r) => (
              <div
                key={r.id}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Vardiya {r.shift}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700">
                      {r.quantityKg.toLocaleString('tr-TR')} KG
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1.5 space-y-0.5">
                    <div>İplik: <strong className="text-slate-800">{r.yarnType}</strong></div>
                    <div>Operatör: <span className="text-slate-800">{r.operator}</span></div>
                    <div>Fire: <span className="text-rose-600 font-mono font-semibold">{r.wasteKg} KG</span></div>
                    {r.notes && <div className="text-slate-500 italic mt-1">"{r.notes}"</div>}
                  </div>
                </div>
                {onEditDayRecord && (
                  <button
                    onClick={() => onEditDayRecord(r)}
                    className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 py-1 bg-slate-50 hover:bg-blue-50 rounded border border-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Kaydı Düzenle</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
