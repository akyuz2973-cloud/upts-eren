import React, { useState, useMemo, useEffect } from 'react';
import {
  DailyShiftProduction,
  ProductLineRule,
  ProductionRecord,
  ShiftCode,
  ShowcaseSlide,
  StationProductionRow,
  VortexMachineRule
} from './types';
import {
  generateInitialRecords,
  INITIAL_PRODUCT_LINES,
  INITIAL_VORTEX_MACHINES,
  INITIAL_STATION_PRODUCTION,
  INITIAL_SHOWCASE_SLIDES,
  SHIFTS
} from './data/initialData';
import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { MonthlyMatrix } from './components/MonthlyMatrix';
import { ChampionSection } from './components/ChampionSection';
import { DigitalSignageVitrin } from './components/DigitalSignageVitrin';
import { DataEntryModal } from './components/DataEntryModal';
import { BulkUploadModal } from './components/BulkUploadModal';
import {
  Trophy,
  Tv,
  PlusCircle,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

const TOUR_STEPS = [
  { id: 'dashboard', label: 'Özet Pano' },
  { id: 'matrix', label: 'Aylık Matris' },
  { id: 'champion', label: 'Şampiyon Vardiya' },
  { id: 'vitrin', label: 'Dijital Vitrin' },
];

const TOUR_DURATION = 15; // 15 saniyede bir adımları dolaşsın

export default function App() {
  // 1. Core State with LocalStorage Caching
  const [records, setRecords] = useState<ProductionRecord[]>(() => {
    try {
      const cached = localStorage.getItem('eren_tekstil_records');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return generateInitialRecords();
  });

  const [productLines, setProductLines] = useState<ProductLineRule[]>(() => {
    try {
      const cached = localStorage.getItem('eren_tekstil_product_lines');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return INITIAL_PRODUCT_LINES;
  });

  const [vortexMachines, setVortexMachines] = useState<VortexMachineRule[]>(() => {
    try {
      const cached = localStorage.getItem('eren_tekstil_vortex_machines');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return INITIAL_VORTEX_MACHINES;
  });

  const [stationProductions, setStationProductions] = useState<StationProductionRow[]>(() => {
    try {
      const cached = localStorage.getItem('eren_tekstil_station_productions');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return INITIAL_STATION_PRODUCTION;
  });

  const [slogan, setSlogan] = useState<string>(() => {
    return localStorage.getItem('eren_tekstil_slogan') || 'Başarı ekip işidir.';
  });

  const [slides, setSlides] = useState<ShowcaseSlide[]>(INITIAL_SHOWCASE_SLIDES);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07');
  const [isSingleEntryOpen, setIsSingleEntryOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null);
  const [isFullscreenVitrin, setIsFullscreenVitrin] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 15sn Otomatik Tur Modu State
  const [isAutoTourActive, setIsAutoTourActive] = useState<boolean>(true);
  const [tourSecondsRemaining, setTourSecondsRemaining] = useState<number>(TOUR_DURATION);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number>(15);
  const [championTourPhase, setChampionTourPhase] = useState<'announcement' | 'video'>('announcement');
  const [championVideoRemaining, setChampionVideoRemaining] = useState<number>(15);
  const [tourPhaseLabel, setTourPhaseLabel] = useState<string>('');

  const isPausedDueToModal =
    isSingleEntryOpen || isBulkUploadOpen || editingRecord !== null || isFullscreenVitrin;

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eren_tekstil_records', JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('eren_tekstil_product_lines', JSON.stringify(productLines));
      localStorage.setItem('eren_tekstil_vortex_machines', JSON.stringify(vortexMachines));
      localStorage.setItem('eren_tekstil_station_productions', JSON.stringify(stationProductions));
      localStorage.setItem('eren_tekstil_slogan', slogan);
    } catch {
      // ignore
    }
  }, [productLines, vortexMachines, stationProductions, slogan]);

  // 15 Saniyede Bir Adımları Dolaşma ve Şampiyonluk / Video Süresi Yönetimi
  useEffect(() => {
    if (!isAutoTourActive || isPausedDueToModal) return;

    let animFrameId: number;
    const startTime = performance.now();

    // Şampiyon Vardiya ekranında: 15sn Şampiyonluk İlanı + Ayrı Video Süresi
    const CHAMPION_ANNOUNCE_MS = 15000; // 15 saniye Vardiya Şampiyonu
    const VIDEO_PLAY_MS = videoDurationSeconds * 1000; // 15 saniye Kutlama Videosu (15sn dışında)
    const championTotalMs = CHAMPION_ANNOUNCE_MS + VIDEO_PLAY_MS;

    const stepDurationMs = activeTab === 'champion' ? championTotalMs : TOUR_DURATION * 1000;

    // Sekmeye ilk gelindiğinde tepeye sıfırla
    window.scrollTo({ top: 0, behavior: 'instant' });

    const tick = (now: number) => {
      const elapsed = now - startTime;

      // 1. AYLIK MATRİS SEKMESİ: Tabloyu tamamiyle görmek için kademeli olarak aşağı aksın
      if (activeTab === 'matrix') {
        const holdTopMs = 1500; // İlk 1.5 saniye üst başlık sabit görünür
        const flowEndMs = 13800; // 13.8 saniyeye kadar kademeli ve kesintisiz akar

        if (elapsed > holdTopMs && elapsed <= flowEndMs) {
          const scrollProgress = (elapsed - holdTopMs) / (flowEndMs - holdTopMs);
          const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          );

          if (maxScroll > 0) {
            window.scrollTo({
              top: scrollProgress * maxScroll,
              behavior: 'auto',
            });
          }
        } else if (elapsed > flowEndMs) {
          // Son saniyede tablonun en altı (Genel Toplamlar) net şekilde görünür
          const maxScroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
          );
          if (maxScroll > 0) {
            window.scrollTo({ top: maxScroll, behavior: 'auto' });
          }
        }

        const remainingSeconds = Math.max(0, Math.ceil((stepDurationMs - elapsed) / 1000));
        setTourSecondsRemaining(remainingSeconds);
        setTourPhaseLabel('');

        if (elapsed >= stepDurationMs) {
          setActiveTab('champion');
          setTourSecondsRemaining(TOUR_DURATION);
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
      } else if (activeTab === 'champion') {
        // 2. ŞAMPİYON VARDİYA SEKMESİ:
        // Kullanıcı İsteği: "kutlama videosu süresi, vardiya şampiyonu kısmındaki 15 sn süre dışında ayrı video süresince gösterilsin"
        if (elapsed < CHAMPION_ANNOUNCE_MS) {
          // FAZ 1: Vardiya Şampiyonu 15 Saniyelik İlan Süresi
          const remainingAnnounceSec = Math.max(0, Math.ceil((CHAMPION_ANNOUNCE_MS - elapsed) / 1000));
          setTourSecondsRemaining(remainingAnnounceSec);
          setChampionTourPhase('announcement');
          setTourPhaseLabel('Şampiyon İlanı');
        } else {
          // FAZ 2: Kutlama Videosu Süresi (15 saniye DIŞINDA ayrı gösterilen video süresi)
          const remainingVideoSec = Math.max(0, Math.ceil((championTotalMs - elapsed) / 1000));
          setTourSecondsRemaining(remainingVideoSec);
          setChampionVideoRemaining(remainingVideoSec);
          setChampionTourPhase('video');
          setTourPhaseLabel('Kutlama Videosu');

          // 15 saniyelik şampiyonluk süresi tamamlandığı anda alttaki kutlama videosuna in ve oynat
          if (elapsed >= CHAMPION_ANNOUNCE_MS && elapsed <= CHAMPION_ANNOUNCE_MS + 250) {
            const videoElement = document.getElementById('champion-celebration-video');
            if (videoElement) {
              videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              const vid = videoElement.querySelector('video') as HTMLVideoElement | null;
              if (vid) {
                vid.play().catch(() => {});
              }
            }
          }
        }

        // 15sn Vardiya Şampiyonu + Video Süresi bittiğinde bir sonraki sekmeye ('vitrin') geç
        if (elapsed >= championTotalMs) {
          setActiveTab('vitrin');
          setTourSecondsRemaining(TOUR_DURATION);
          setTourPhaseLabel('');
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
      } else {
        // Diğer sekmeler (dashboard, vitrin): Standart 15 saniye
        const remainingSeconds = Math.max(0, Math.ceil((stepDurationMs - elapsed) / 1000));
        setTourSecondsRemaining(remainingSeconds);
        setTourPhaseLabel('');

        if (elapsed >= stepDurationMs) {
          setActiveTab((currentTab) => {
            const currentIndex = TOUR_STEPS.findIndex((s) => s.id === currentTab);
            const nextIndex = (currentIndex + 1) % TOUR_STEPS.length;
            window.scrollTo({ top: 0, behavior: 'instant' });
            return TOUR_STEPS[nextIndex].id;
          });
          return;
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [isAutoTourActive, isPausedDueToModal, activeTab]);

  const handleManualTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setTourSecondsRemaining(TOUR_DURATION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextTourStep = () => {
    const currentIndex = TOUR_STEPS.findIndex((s) => s.id === activeTab);
    const nextIndex = (currentIndex + 1) % TOUR_STEPS.length;
    setActiveTab(TOUR_STEPS[nextIndex].id);
    setTourSecondsRemaining(TOUR_DURATION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevTourStep = () => {
    const currentIndex = TOUR_STEPS.findIndex((s) => s.id === activeTab);
    const prevIndex = (currentIndex - 1 + TOUR_STEPS.length) % TOUR_STEPS.length;
    setActiveTab(TOUR_STEPS[prevIndex].id);
    setTourSecondsRemaining(TOUR_DURATION);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 2. Computed Monthly Data
  const filteredRecords = useMemo(() => {
    return records.filter((r) => r.date.startsWith(selectedMonth));
  }, [records, selectedMonth]);

  // Aggregate day by day for the matrix table
  const dailyMatrix = useMemo<DailyShiftProduction[]>(() => {
    const daysInMonth = 31; // July has 31 days
    const dayMap = new Map<number, {
      shiftA: number;
      shiftB: number;
      shiftC: number;
      wasteA: number;
      wasteB: number;
      wasteC: number;
    }>();

    for (let d = 1; d <= daysInMonth; d++) {
      dayMap.set(d, { shiftA: 0, shiftB: 0, shiftC: 0, wasteA: 0, wasteB: 0, wasteC: 0 });
    }

    filteredRecords.forEach((r) => {
      const day = r.dayNumber;
      const cur = dayMap.get(day);
      if (cur) {
        if (r.shift === 'A') {
          cur.shiftA += r.quantityKg;
          cur.wasteA += r.wasteKg;
        } else if (r.shift === 'B') {
          cur.shiftB += r.quantityKg;
          cur.wasteB += r.wasteKg;
        } else if (r.shift === 'C') {
          cur.shiftC += r.quantityKg;
          cur.wasteC += r.wasteKg;
        }
      }
    });

    const rows: DailyShiftProduction[] = [];
    dayMap.forEach((val, day) => {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const totalKg = val.shiftA + val.shiftB + val.shiftC;
      const totalWasteKg = val.wasteA + val.wasteB + val.wasteC;

      let topShift: ShiftCode = 'A';
      if (val.shiftB > val.shiftA && val.shiftB >= val.shiftC) {
        topShift = 'B';
      } else if (val.shiftC > val.shiftA && val.shiftC > val.shiftB) {
        topShift = 'C';
      }

      rows.push({
        date: `${selectedMonth}-${dayStr}`,
        dayNumber: day,
        shiftA: val.shiftA,
        shiftB: val.shiftB,
        shiftC: val.shiftC,
        wasteA: val.wasteA,
        wasteB: val.wasteB,
        wasteC: val.wasteC,
        totalKg,
        totalWasteKg,
        topShift,
      });
    });

    return rows;
  }, [filteredRecords, selectedMonth]);

  // Totals for Month
  const shiftTotals = useMemo(() => {
    let A = 0;
    let B = 0;
    let C = 0;
    filteredRecords.forEach((r) => {
      if (r.shift === 'A') A += r.quantityKg;
      if (r.shift === 'B') B += r.quantityKg;
      if (r.shift === 'C') C += r.quantityKg;
    });
    return { A, B, C };
  }, [filteredRecords]);

  const shiftWastes = useMemo(() => {
    let A = 0;
    let B = 0;
    let C = 0;
    filteredRecords.forEach((r) => {
      if (r.shift === 'A') A += r.wasteKg;
      if (r.shift === 'B') B += r.wasteKg;
      if (r.shift === 'C') C += r.wasteKg;
    });
    return { A, B, C };
  }, [filteredRecords]);

  const grandTotal = shiftTotals.A + shiftTotals.B + shiftTotals.C;
  const grandWasteTotal = shiftWastes.A + shiftWastes.B + shiftWastes.C;
  const wasteRatePercent = grandTotal > 0 ? (grandWasteTotal / grandTotal) * 100 : 0;

  // Auto-calculated Leader Shift
  const leaderShift: ShiftCode = useMemo(() => {
    if (shiftTotals.B > shiftTotals.A && shiftTotals.B >= shiftTotals.C) return 'B';
    if (shiftTotals.C > shiftTotals.A && shiftTotals.C > shiftTotals.B) return 'C';
    return 'A'; // Defaults to A if highest or tie
  }, [shiftTotals]);

  const leaderShiftKg = shiftTotals[leaderShift];

  // Today's total (using day 31 or today)
  const todayTotalKg = useMemo(() => {
    if (dailyMatrix.length === 0) return 0;
    const latestDay = dailyMatrix[dailyMatrix.length - 1];
    return latestDay.totalKg;
  }, [dailyMatrix]);

  const monthLabel = selectedMonth === '2026-07' ? 'Temmuz 2026' : selectedMonth;

  // 3. Handlers
  const handleSaveRecord = (newRec: ProductionRecord) => {
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.id === newRec.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRec;
        return copy;
      }
      return [newRec, ...prev];
    });
    showToast(`Vardiya kaydı (${newRec.quantityKg.toLocaleString('tr-TR')} KG) başarıyla kaydedildi.`);
  };

  const handleBulkImport = (newRecords: ProductionRecord[], replaceAll: boolean) => {
    if (replaceAll) {
      setRecords(newRecords);
    } else {
      setRecords((prev) => [...newRecords, ...prev]);
    }
    showToast(`${newRecords.length} adet üretim kaydı başarıyla sisteme aktarıldı.`);
  };

  const handleEditRecord = (rec: ProductionRecord) => {
    setEditingRecord(rec);
    setIsSingleEntryOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleManualTabChange}
        onOpenSingleEntry={() => {
          setEditingRecord(null);
          setIsSingleEntryOpen(true);
        }}
        onOpenBulkUpload={() => setIsBulkUploadOpen(true)}
        onOpenKioskMode={() => {
          handleManualTabChange('vitrin');
          setIsFullscreenVitrin(true);
        }}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        isAutoTourActive={isAutoTourActive}
        setIsAutoTourActive={setIsAutoTourActive}
        tourSecondsRemaining={tourSecondsRemaining}
        tourPhaseLabel={tourPhaseLabel}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* TAB 1: DASHBOARD & SUMMARY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* KPI Cards */}
            <KpiSummary
              todayTotalKg={todayTotalKg}
              monthTotalKg={grandTotal}
              monthWasteKg={grandWasteTotal}
              wasteRatePercent={wasteRatePercent}
              leaderShift={leaderShift}
              leaderShiftKg={leaderShiftKg}
              shiftTotals={shiftTotals}
              onGoToChampion={() => handleManualTabChange('champion')}
            />

            {/* Quick Action Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Üretim Takip ve Dijital Vitrin Hazır
                  </h4>
                  <p className="text-xs text-slate-600">
                    Mevcut ayın lideri <strong className="text-amber-800">Vardiya {leaderShift}</strong> olup, dinamik fabrika TV vitrinini (1-5 sn döngü) tam ekran başlatabilir veya aylık matrisi inceleyebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleManualTabChange('matrix')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  Matrise Git
                </button>
                <button
                  onClick={() => {
                    handleManualTabChange('vitrin');
                    setIsFullscreenVitrin(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>TV Vitrini Aç</span>
                </button>
              </div>
            </div>

            {/* 3 Vardiya Performans ve Detay Gösterge Kartları */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Vardiya Üretim ve Performans Detayları</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {monthLabel} dönemi vardiya amirleri, çalışma saatleri ve gerçekleşen üretim metrikleri
                  </p>
                </div>
                <button
                  onClick={() => handleManualTabChange('matrix')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>31 Günlük Detay Matrisini İncele</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Vardiya A */}
                <div className={`p-5 rounded-xl border transition-all ${
                  leaderShift === 'A' 
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      1. Vardiya (A) · 08:00 - 16:00
                    </span>
                    {leaderShift === 'A' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-slate-950" />
                        <span>Ayın Lideri</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        2. Sırada
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {shiftTotals.A.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">KG</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vardiya Amiri:</span>
                      <span className="font-semibold text-slate-800">Ahmet Yılmaz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fire Miktarı:</span>
                      <span className="font-mono text-rose-600 font-semibold">{shiftWastes.A.toLocaleString('tr-TR')} KG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Randıman:</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        %{((1 - (shiftWastes.A / (shiftTotals.A || 1))) * 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Vardiya B */}
                <div className={`p-5 rounded-xl border transition-all ${
                  leaderShift === 'B' 
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      2. Vardiya (B) · 16:00 - 00:00
                    </span>
                    {leaderShift === 'B' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-slate-950" />
                        <span>Ayın Lideri</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        2. Sırada
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {shiftTotals.B.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">KG</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vardiya Amiri:</span>
                      <span className="font-semibold text-slate-800">Mehmet Demir</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fire Miktarı:</span>
                      <span className="font-mono text-rose-600 font-semibold">{shiftWastes.B.toLocaleString('tr-TR')} KG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Randıman:</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        %{((1 - (shiftWastes.B / (shiftTotals.B || 1))) * 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Vardiya C */}
                <div className={`p-5 rounded-xl border transition-all ${
                  leaderShift === 'C' 
                    ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs' 
                    : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      3. Vardiya (C) · 00:00 - 08:00
                    </span>
                    {leaderShift === 'C' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md flex items-center gap-1">
                        <Trophy className="w-3 h-3 fill-slate-950" />
                        <span>Ayın Lideri</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        3. Sırada
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {shiftTotals.C.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">KG</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vardiya Amiri:</span>
                      <span className="font-semibold text-slate-800">Hasan Kaya</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fire Miktarı:</span>
                      <span className="font-mono text-rose-600 font-semibold">{shiftWastes.C.toLocaleString('tr-TR')} KG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Randıman:</span>
                      <span className="font-mono text-emerald-600 font-semibold">
                        %{((1 - (shiftWastes.C / (shiftTotals.C || 1))) * 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fabrika Operasyon ve İplik Hatları Genel Durumu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Üretim Kapasite & Günlük Ortalama</span>
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Aktif Çalışma
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">Günlük Ortalama:</span>
                    <span className="text-lg font-bold font-mono text-slate-900">
                      {Math.round(grandTotal / 31).toLocaleString('tr-TR')} KG
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-500 block">En Yüksek Günlük:</span>
                    <span className="text-lg font-bold font-mono text-blue-700">
                      43.850 KG
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  3 vardiyada toplam 20 Vortex iplik makinesi ve tarak/pasaj cer hatları tam randımanla çalışmaktadır.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Hızlı İşlemler & Kısayollar</span>
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Yeni günlük veya vardiya bazlı üretim verisi girebilir, Excel aktarımı yapabilir veya şampiyonluk ekranını açabilirsiniz.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingRecord(null);
                      setIsSingleEntryOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Tekli Veri Girişi</span>
                  </button>
                  <button
                    onClick={() => setIsBulkUploadOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Excel/CSV Yükle</span>
                  </button>
                  <button
                    onClick={() => handleManualTabChange('champion')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                    <span>Şampiyonluk Ekranı</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AYLIK VARDİYA MATRİSİ */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <MonthlyMatrix
              dailyData={dailyMatrix}
              records={records}
              monthLabel={monthLabel}
              totalA={shiftTotals.A}
              totalB={shiftTotals.B}
              totalC={shiftTotals.C}
              grandTotal={grandTotal}
              onEditDayRecord={handleEditRecord}
              onAddNewForDate={(date, shift) => {
                setEditingRecord(null);
                setIsSingleEntryOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: ŞAMPİYON VARDİYA & KUTLAMA VİDEOSU */}
        {activeTab === 'champion' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ChampionSection
              monthLabel={monthLabel}
              leaderShift={leaderShift}
              shiftTotals={shiftTotals}
              shiftWastes={shiftWastes}
              grandTotal={grandTotal}
              tourPhase={championTourPhase}
              videoSecondsRemaining={championVideoRemaining}
              videoTotalDuration={videoDurationSeconds}
              onSetVideoDuration={(sec) => setVideoDurationSeconds(sec)}
              isAutoTourActive={isAutoTourActive}
            />
          </div>
        )}

        {/* TAB 4: DİJİTAL VİTRİN PANOSU */}
        {activeTab === 'vitrin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <DigitalSignageVitrin
              slides={slides}
              setSlides={setSlides}
              productLines={productLines}
              setProductLines={setProductLines}
              vortexMachines={vortexMachines}
              setVortexMachines={setVortexMachines}
              stationProductions={stationProductions}
              setStationProductions={setStationProductions}
              slogan={slogan}
              setSlogan={setSlogan}
              leaderShift={leaderShift}
              leaderKg={leaderShiftKg}
              isFullscreen={isFullscreenVitrin}
              setIsFullscreen={setIsFullscreenVitrin}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <DataEntryModal
        isOpen={isSingleEntryOpen}
        onClose={() => {
          setIsSingleEntryOpen(false);
          setEditingRecord(null);
        }}
        onSaveRecord={handleSaveRecord}
        editingRecord={editingRecord}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onBulkImport={handleBulkImport}
      />

      {/* Clean Industrial Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-800">EREN TEKSTİL A.Ş.</span>
            <span>·</span>
            <span>İplik Fabrikası Üretim ve Vardiya Yönetim Sistemi</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Vortex İplik Teknolojisi</span>
            <span>·</span>
            <span className="italic font-semibold text-blue-700">"Başarı ekip işidir."</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
