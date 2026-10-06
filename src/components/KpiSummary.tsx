import React from 'react';
import {
  Trophy,
  Scale,
  CalendarCheck,
  TrendingUp,
  Percent,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';
import { ShiftCode } from '../types';

interface KpiSummaryProps {
  todayTotalKg: number;
  monthTotalKg: number;
  monthWasteKg: number;
  wasteRatePercent: number;
  leaderShift: ShiftCode;
  leaderShiftKg: number;
  shiftTotals: {
    A: number;
    B: number;
    C: number;
  };
  onGoToChampion: () => void;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  todayTotalKg,
  monthTotalKg,
  monthWasteKg,
  wasteRatePercent,
  leaderShift,
  leaderShiftKg,
  shiftTotals,
  onGoToChampion,
}) => {
  const percentA = monthTotalKg > 0 ? ((shiftTotals.A / monthTotalKg) * 100).toFixed(1) : '0';
  const percentB = monthTotalKg > 0 ? ((shiftTotals.B / monthTotalKg) * 100).toFixed(1) : '0';
  const percentC = monthTotalKg > 0 ? ((shiftTotals.C / monthTotalKg) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-4">
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Bugünkü Toplam Üretim */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bugünkü Üretim
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {todayTotalKg.toLocaleString('tr-TR')}
            </span>
            <span className="text-sm font-semibold text-slate-500">KG</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>3 vardiya aktif iplik çekimi</span>
          </div>
        </div>

        {/* 2. Seçilen Ayın Toplam Üretimi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aylık Toplam Üretim
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {monthTotalKg.toLocaleString('tr-TR')}
            </span>
            <span className="text-sm font-semibold text-slate-500">KG</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Hedef gerçekleşme: %103.2</span>
          </div>
        </div>

        {/* 3. Ayın Lider Vardiyası */}
        <div 
          onClick={onGoToChampion}
          className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5 shadow-xs hover:border-amber-400 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <span>Ayın Şampiyonu</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4 fill-white text-white" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-950">
              Vardiya {leaderShift}
            </span>
            <span className="text-xs font-semibold text-amber-700 font-mono tabular-nums">
              ({leaderShiftKg.toLocaleString('tr-TR')} KG)
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-amber-800 flex items-center justify-between">
            <span>Kutlama Ekranını Gör</span>
            <span className="text-amber-600 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* 4. Fire Oranı */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aylık Fire Oranı
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              %{wasteRatePercent.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-rose-600 font-mono tabular-nums">
              ({monthWasteKg.toLocaleString('tr-TR')} KG)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">Hedef sınır altında (&lt; %2.5)</span>
          </div>
        </div>
      </div>

      {/* Vardiya Üretim Payı Hızlı Şeridi */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Vardiya Üretim Dağılımı (KG)</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-amber-700">Vardiya A: {shiftTotals.A.toLocaleString('tr-TR')} KG (%{percentA})</span>
            <span className="text-blue-700">Vardiya B: {shiftTotals.B.toLocaleString('tr-TR')} KG (%{percentB})</span>
            <span className="text-emerald-700">Vardiya C: {shiftTotals.C.toLocaleString('tr-TR')} KG (%{percentC})</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${percentA}%` }}
            className="bg-amber-500 hover:bg-amber-600 transition-all h-full"
            title={`Vardiya A: ${shiftTotals.A.toLocaleString('tr-TR')} KG (%${percentA})`}
          />
          <div
            style={{ width: `${percentB}%` }}
            className="bg-blue-600 hover:bg-blue-700 transition-all h-full"
            title={`Vardiya B: ${shiftTotals.B.toLocaleString('tr-TR')} KG (%${percentB})`}
          />
          <div
            style={{ width: `${percentC}%` }}
            className="bg-emerald-600 hover:bg-emerald-700 transition-all h-full"
            title={`Vardiya C: ${shiftTotals.C.toLocaleString('tr-TR')} KG (%${percentC})`}
          />
        </div>
      </div>
    </div>
  );
};
