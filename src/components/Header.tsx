import React from 'react';
import {
  Trophy,
  Tv,
  PlusCircle,
  FileSpreadsheet,
  UploadCloud,
  Layers,
  CalendarDays,
  LayoutDashboard,
  Play,
  Pause,
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSingleEntry: () => void;
  onOpenBulkUpload: () => void;
  onOpenKioskMode: () => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  isAutoTourActive?: boolean;
  setIsAutoTourActive?: (active: boolean) => void;
  tourSecondsRemaining?: number;
  tourPhaseLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSingleEntry,
  onOpenBulkUpload,
  onOpenKioskMode,
  selectedMonth,
  setSelectedMonth,
  isAutoTourActive = true,
  setIsAutoTourActive,
  tourSecondsRemaining = 15,
  tourPhaseLabel,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Özet Pano', icon: LayoutDashboard },
    { id: 'matrix', label: 'Aylık Matris', icon: CalendarDays },
    { id: 'champion', label: 'Şampiyon Vardiya', icon: Trophy },
    { id: 'vitrin', label: 'Dijital Vitrin', icon: Tv },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">
                  EREN <span className="text-blue-600 font-semibold">TEKSTİL</span>
                </span>
                <span className="text-[10px] text-slate-700 font-medium tracking-wider uppercase">
                  İplik Üretim & Vardiya Takip
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            {/* 15sn Otomatik Tur Durdur / Başlat Butonu */}
            {setIsAutoTourActive && (
              <button
                onClick={() => setIsAutoTourActive(!isAutoTourActive)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all shadow-xs border ${
                  isAutoTourActive
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
                title={
                  isAutoTourActive
                    ? 'İşlem yapmak için otomatik gezinmeyi durdur'
                    : '15 saniyelik otomatik fabrika turunu başlat'
                }
              >
                {isAutoTourActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-amber-700 text-amber-700 shrink-0" />
                    <span className="hidden sm:inline">
                      {tourPhaseLabel || 'Turu Durdur'}
                    </span>
                    <span className="sm:hidden">Durdur</span>
                    {tourPhaseLabel === 'Kutlama Videosu' ? (
                      <span className="font-mono text-[11px] bg-amber-200/90 px-1.5 py-0.5 rounded text-amber-950 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        <span>Video</span>
                      </span>
                    ) : (
                      <span className="font-mono text-[11px] bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900 font-bold">
                        {tourSecondsRemaining}s
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
                    <span className="hidden sm:inline">15sn Turu Başlat</span>
                    <span className="sm:hidden">Tur Başlat</span>
                  </>
                )}
              </button>
            )}

            {/* Month Selector */}
            <div className="hidden xl:flex items-center">
              <select
                aria-label="Ay Seçimi"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border-none rounded-lg px-2.5 py-2 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="2026-07">Temmuz 2026</option>
                <option value="2026-08">Ağustos 2026</option>
                <option value="2026-09">Eylül 2026</option>
              </select>
            </div>

            {/* Vitrin TV Kiosk Mode */}
            <button
              onClick={onOpenKioskMode}
              title="Fabrika TV Vitrin Panosunu Tam Ekran Başlat (20sn otomatik döngü)"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <Tv className="w-3.5 h-3.5 text-blue-600" />
              <span>TV Vitrini</span>
            </button>

            {/* Bulk Upload */}
            <button
              onClick={onOpenBulkUpload}
              title="Excel / CSV Toplu Veri Yükleme"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span>Excel Yükle</span>
            </button>

            {/* Single Entry */}
            <button
              onClick={onOpenSingleEntry}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Veri Girişi</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
