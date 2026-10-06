import React, { useState, useEffect, useRef } from 'react';
import {
  ProductLineRule,
  ShiftCode,
  ShowcaseSlide,
  StationProductionRow,
  VortexMachineRule
} from '../types';
import {
  Tv,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Clock,
  Sparkles,
  Trophy,
  Layers,
  CheckCircle2,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { BRANDS } from '../data/initialData';
import { SlideEditorModal } from './SlideEditorModal';

interface DigitalSignageVitrinProps {
  slides: ShowcaseSlide[];
  setSlides: (slides: ShowcaseSlide[]) => void;
  productLines: ProductLineRule[];
  setProductLines: (lines: ProductLineRule[]) => void;
  vortexMachines: VortexMachineRule[];
  setVortexMachines: (machines: VortexMachineRule[]) => void;
  stationProductions: StationProductionRow[];
  setStationProductions: (rows: StationProductionRow[]) => void;
  slogan: string;
  setSlogan: (slogan: string) => void;
  leaderShift: ShiftCode;
  leaderKg: number;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
}

export const DigitalSignageVitrin: React.FC<DigitalSignageVitrinProps> = ({
  slides,
  setSlides,
  productLines,
  setProductLines,
  vortexMachines,
  setVortexMachines,
  stationProductions,
  setStationProductions,
  slogan,
  setSlogan,
  leaderShift,
  leaderKg,
  isFullscreen,
  setIsFullscreen,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalSeconds, setIntervalSeconds] = useState(1); // Varsayılan 1 saniyede bir sürekli dönsün!
  const [progress, setProgress] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Timer loop for slide transition
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const stepMs = 50;
    const totalSteps = (intervalSeconds * 1000) / stepMs;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const currentProgress = (stepCount / totalSteps) * 100;
      setProgress(currentProgress);

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setProgress(0);
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPlaying, intervalSeconds, slides.length, currentSlideIndex]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
      if (e.key === 'ArrowRight') {
        goToNext();
      }
      if (e.key === 'ArrowLeft') {
        goToPrev();
      }
      if (e.key === ' ') {
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const goToNext = () => {
    setProgress(0);
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setProgress(0);
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Render content of current slide matching user's photos
  const renderSlideContent = () => {
    switch (currentSlide.type) {
      // 1. BRAND SLIDE (Fotoğraf 1)
      case 'brand':
        return (
          <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-white select-none">
            {/* Top brand header */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
              <div className="mb-2">
                <span className="text-4xl sm:text-7xl font-serif font-black tracking-tighter text-[#004b93] italic lowercase">
                  eren
                </span>
                <span className="block text-2xl sm:text-5xl font-extrabold tracking-widest text-slate-900 uppercase mt-1">
                  TEKSTİL
                </span>
              </div>
              <div className="w-24 h-1 bg-[#0080cc] rounded-full my-6"></div>

              {/* Brands grid matching Photo #1 */}
              <div className="w-full max-w-4xl px-4">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm sm:text-lg font-bold tracking-wider text-slate-800">
                  <span className="hover:text-blue-600 transition-colors">LACOSTE 🐊</span>
                  <span className="text-slate-300">|</span>
                  <span className="hover:text-blue-600 transition-colors">BURBERRY</span>
                  <span className="text-slate-300">|</span>
                  <span className="hover:text-blue-600 transition-colors">GANT</span>
                  <span className="text-slate-300">|</span>
                  <span className="hover:text-blue-600 transition-colors">Fash'Fed.</span>
                </div>

                <div className="h-px bg-slate-200 my-4 max-w-2xl mx-auto"></div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs sm:text-base font-semibold text-slate-700">
                  <span>House of SuperStep</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-red-600 font-bold">SuperStep</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600 font-bold">SuperKiDS</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono font-bold">CONVERSE ★</span>
                </div>

                <div className="h-px bg-slate-200 my-4 max-w-2xl mx-auto"></div>

                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs sm:text-base font-semibold text-slate-600">
                  <span className="text-blue-800 font-bold">INTERSPORT</span>
                  <span className="text-slate-300">|</span>
                  <span>HeartBeat</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-serif">NAUTICA</span>
                  <span className="text-slate-300">|</span>
                  <span>occasion</span>
                  <span className="text-slate-300">|</span>
                  <span className="font-mono">UTD4</span>
                </div>
              </div>
            </div>

            {/* Cyan bottom bar from photo 1 */}
            <div className="h-8 bg-[#0080cc] w-full rounded-b-lg -mb-6 -mx-6 sm:-mb-10 sm:-mx-10 mt-6" />
          </div>
        );

      // 2. PRODUCT LINE & BAG COLORS (Fotoğraf 2)
      case 'product_line':
        return (
          <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#f8fafc]">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-xs sm:text-sm shadow-xs">
                <thead>
                  <tr className="bg-[#0070ba] text-white font-bold text-center">
                    <th className="py-3 px-3 border border-[#005a96] w-1/4">ÜRÜN</th>
                    <th className="py-3 px-3 border border-[#005a96]">ÇALIŞTIĞI HAT</th>
                    <th className="py-3 px-3 border border-[#005a96]">KUŞAK RENGİ</th>
                    <th className="py-3 px-3 border border-[#005a96]">ŞERİT TELEFİ ÇUVAL RENGİ</th>
                    <th className="py-3 px-3 border border-[#005a96]">ÜSTÜBÜ ÇUVAL RENGİ</th>
                    <th className="py-3 px-3 border border-[#005a96]">MEYDAN ÇUVAL RENGİ</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-900 text-center">
                  {productLines.map((line, idx) => (
                    <tr
                      key={line.id}
                      className={idx % 2 === 0 ? 'bg-[#dbe7f6]' : 'bg-[#e9f1fa]'}
                    >
                      <td className="py-4 px-3 border border-slate-300 text-left">
                        {line.products.map((p, pIdx) => (
                          <div key={pIdx} className="font-bold">
                            {pIdx + 1}. {p}
                          </div>
                        ))}
                      </td>
                      <td className="py-4 px-3 border border-slate-300 font-extrabold text-[#003865]">
                        {line.line}
                      </td>
                      <td className="py-4 px-3 border border-slate-300">
                        <span className={`inline-block px-3 py-1 rounded font-bold ${
                          line.beltColor.includes('TURUNCU')
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {line.beltColor}
                        </span>
                      </td>
                      <td className="py-4 px-3 border border-slate-300">
                        <span className={`inline-block px-3 py-1 rounded font-bold ${
                          line.sliverBagColor === 'KIRMIZI'
                            ? 'bg-red-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {line.sliverBagColor}
                        </span>
                      </td>
                      <td className="py-4 px-3 border border-slate-300 bg-white">
                        <span className="text-slate-900 font-bold">{line.wasteBagColor}</span>
                      </td>
                      <td className="py-4 px-3 border border-slate-300 bg-white">
                        <span className="text-slate-900 font-bold">{line.floorBagColor}</span>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to match industrial poster look */}
                  <tr className="bg-[#e9f1fa] h-12">
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                    <td className="border border-slate-300"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Azure bottom bar */}
            <div className="h-6 bg-[#0080cc] w-full rounded-b-lg -mb-4 -mx-4 sm:-mb-8 sm:-mx-8 mt-4" />
          </div>
        );

      // 3. VORTEX 1 - 12 (Fotoğraf 3)
      case 'vortex_1_12':
        const machines1_12 = vortexMachines.filter((m) => m.vortexNo <= 12);
        return (
          <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#f8fafc]">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-xs sm:text-sm shadow-xs">
                <thead>
                  <tr className="bg-[#0070ba] text-white font-bold text-center">
                    <th className="py-2.5 px-3 border border-[#005a96] w-24">VORTEX NO:</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">ÜRÜN</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">KONİK RENGİ</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">BANDAJ RENGİ</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-900 text-center">
                  {machines1_12.map((m) => {
                    const isViskon = m.product.includes('VİSKON');
                    return (
                      <tr
                        key={m.vortexNo}
                        className={isViskon ? 'bg-[#d8e6f7]' : 'bg-[#eaf1fb] hover:bg-white'}
                      >
                        <td className="py-1.5 px-3 border border-slate-300 font-extrabold text-slate-800">
                          {m.vortexNo}
                        </td>
                        <td className="py-1.5 px-3 border border-slate-300 font-bold text-left pl-6">
                          {m.product}
                        </td>
                        <td className="py-1.5 px-3 border border-slate-300 font-extrabold">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            m.conicalColor.includes('YEŞİL') ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {m.conicalColor}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 border border-slate-300 font-extrabold">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            m.bandageColor.includes('TURUNCU') ? 'bg-orange-100 text-orange-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {m.bandageColor}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Azure bottom bar */}
            <div className="h-6 bg-[#0080cc] w-full rounded-b-lg -mb-4 -mx-4 sm:-mb-8 sm:-mx-8 mt-4" />
          </div>
        );

      // 4. VORTEX 13 - 20 (Fotoğraf 4)
      case 'vortex_13_20':
        const machines13_20 = vortexMachines.filter((m) => m.vortexNo > 12);
        return (
          <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#f8fafc]">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-xs sm:text-sm shadow-xs">
                <thead>
                  <tr className="bg-[#0070ba] text-white font-bold text-center">
                    <th className="py-2.5 px-3 border border-[#005a96] w-24">VORTEX NO:</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">ÜRÜN</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">KONİK RENGİ</th>
                    <th className="py-2.5 px-3 border border-[#005a96]">BANDAJ RENGİ</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-900 text-center">
                  {machines13_20.map((m) => {
                    const isViskon = m.product.includes('VİSKON');
                    return (
                      <tr
                        key={m.vortexNo}
                        className={isViskon ? 'bg-[#d8e6f7]' : 'bg-[#eaf1fb] hover:bg-white'}
                      >
                        <td className="py-2 px-3 border border-slate-300 font-extrabold text-slate-800">
                          {m.vortexNo}
                        </td>
                        <td className="py-2 px-3 border border-slate-300 font-bold text-left pl-6">
                          {m.product}
                        </td>
                        <td className="py-2 px-3 border border-slate-300 font-extrabold">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            m.conicalColor.includes('YEŞİL') ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {m.conicalColor}
                          </span>
                        </td>
                        <td className="py-2 px-3 border border-slate-300 font-extrabold">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            m.bandageColor.includes('TURUNCU') ? 'bg-orange-100 text-orange-900' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {m.bandageColor}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Azure bottom bar */}
            <div className="h-6 bg-[#0080cc] w-full rounded-b-lg -mb-4 -mx-4 sm:-mb-8 sm:-mx-8 mt-4" />
          </div>
        );

      // 5. İSTASYON BAZLI VARDİYA MATRİSİ (Fotoğraf 6)
      case 'station_matrix':
        return (
          <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#f8fafc]">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-xs sm:text-sm font-sans shadow-xs">
                <thead>
                  <tr className="bg-[#b9c1cb] text-slate-900 font-black text-center">
                    <th className="py-3 px-3 border border-slate-400">VARDİYA BİLGİSİ</th>
                    <th className="py-3 px-3 border border-slate-400">TARAK</th>
                    <th className="py-3 px-3 border border-slate-400">1.PASAJ CER</th>
                    <th className="py-3 px-3 border border-slate-400">2.PASAJ CER</th>
                    <th className="py-3 px-3 border border-slate-400">3.PASAJ CER</th>
                    <th className="py-3 px-3 border border-slate-400">VORTEX</th>
                    <th className="py-3 px-3 border border-slate-400 bg-[#e4a460]">PAKETLEME</th>
                    <th className="py-3 px-3 border border-slate-400 bg-[#e4a460]">TOPLAM</th>
                  </tr>
                </thead>
                <tbody className="text-center font-bold text-slate-900 font-mono">
                  {/* Vardiya A Group */}
                  <tr className="bg-[#fef3c7]/60">
                    <td rowSpan={2} className="py-4 px-3 border border-slate-400 text-2xl font-black text-amber-700 font-sans">
                      A
                    </td>
                    <td className="border border-slate-400 text-xs font-semibold text-amber-900">
                      SENTETİK: {stationProductions[0]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[0]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[0]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[0]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[0]?.vortex.toLocaleString('tr-TR')}</td>
                    <td rowSpan={2} className="border border-slate-400 text-lg font-black bg-amber-50">
                      {stationProductions[0]?.paketleme.toLocaleString('tr-TR')}
                    </td>
                    <td rowSpan={2} className="border border-slate-400 text-xl font-black text-blue-900 bg-amber-100">
                      {stationProductions[0]?.toplam.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                  <tr className="bg-[#fef3c7]/40">
                    <td className="border border-slate-400 text-xs font-semibold text-amber-900">
                      KARIŞIM: {stationProductions[1]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[1]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[1]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[1]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[1]?.vortex.toLocaleString('tr-TR')}</td>
                  </tr>

                  {/* Vardiya B Group */}
                  <tr className="bg-[#dbeafe]/60">
                    <td rowSpan={2} className="py-4 px-3 border border-slate-400 text-2xl font-black text-blue-700 font-sans">
                      B
                    </td>
                    <td className="border border-slate-400 text-xs font-semibold text-red-700">
                      SENTETİK: {stationProductions[2]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[2]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[2]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[2]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[2]?.vortex.toLocaleString('tr-TR')}</td>
                    <td rowSpan={2} className="border border-slate-400 text-lg font-black bg-blue-50">
                      {stationProductions[2]?.paketleme.toLocaleString('tr-TR')}
                    </td>
                    <td rowSpan={2} className="border border-slate-400 text-xl font-black text-blue-900 bg-blue-100">
                      {stationProductions[2]?.toplam.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                  <tr className="bg-[#dbeafe]/40">
                    <td className="border border-slate-400 text-xs font-semibold text-red-700">
                      KARIŞIM: {stationProductions[3]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[3]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[3]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[3]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[3]?.vortex.toLocaleString('tr-TR')}</td>
                  </tr>

                  {/* Vardiya C Group */}
                  <tr className="bg-[#dcfce7]/60">
                    <td rowSpan={2} className="py-4 px-3 border border-slate-400 text-2xl font-black text-emerald-700 font-sans">
                      C
                    </td>
                    <td className="border border-slate-400 text-xs font-semibold text-emerald-900">
                      SENTETİK: {stationProductions[4]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[4]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[4]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[4]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[4]?.vortex.toLocaleString('tr-TR')}</td>
                    <td rowSpan={2} className="border border-slate-400 text-lg font-black bg-emerald-50">
                      {stationProductions[4]?.paketleme.toLocaleString('tr-TR')}
                    </td>
                    <td rowSpan={2} className="border border-slate-400 text-xl font-black text-blue-900 bg-emerald-100">
                      {stationProductions[4]?.toplam.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                  <tr className="bg-[#dcfce7]/40">
                    <td className="border border-slate-400 text-xs font-semibold text-emerald-900">
                      KARIŞIM: {stationProductions[5]?.tarak.toLocaleString('tr-TR')}
                    </td>
                    <td className="border border-slate-400">{stationProductions[5]?.cer1.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[5]?.cer2.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[5]?.cer3.toLocaleString('tr-TR')}</td>
                    <td className="border border-slate-400">{stationProductions[5]?.vortex.toLocaleString('tr-TR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Azure bottom bar */}
            <div className="h-6 bg-[#0080cc] w-full rounded-b-lg -mb-4 -mx-4 sm:-mb-8 sm:-mx-8 mt-4" />
          </div>
        );

      // 6. ŞAMPİYONLUK AFİŞİ (Fotoğraf 7)
      case 'champion_banner':
      default:
        return (
          <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-white select-none">
            {/* Header */}
            <div>
              <div className="text-right text-[10px] text-blue-800 font-mono">
                [Şirkete Özel / Internal Only]
              </div>
              <h2 className="text-center text-xl sm:text-3xl font-black text-slate-900 tracking-wide mt-2">
                TEMMUZ AYI EN YÜKSEK ÜRETİM YAPAN VARDİYA
              </h2>
              <div className="w-full h-px bg-slate-300 my-4" />
            </div>

            {/* 3 Blue Cards matching Photo 7 */}
            <div className="max-w-2xl w-full mx-auto space-y-4 my-auto">
              {/* Vardiya A Card (Champion) */}
              <div className="bg-[#0070ba] text-white p-5 rounded-2xl shadow-md text-center transform hover:scale-[1.02] transition-transform">
                <div className="text-lg sm:text-2xl font-black flex items-center justify-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span>VARDİYA: A</span>
                </div>
                <div className="text-sm sm:text-lg font-bold mt-1 font-mono">
                  Toplam Üretim: {leaderKg.toLocaleString('tr-TR')} KG
                </div>
              </div>

              {/* Vardiya B Card */}
              <div className="bg-[#0070ba] text-white p-4 rounded-2xl shadow-md text-center opacity-95">
                <div className="text-base sm:text-xl font-bold">
                  VARDİYA: B
                </div>
                <div className="text-sm sm:text-base font-semibold mt-1 font-mono">
                  Toplam Üretim: 399.921 KG
                </div>
              </div>

              {/* Vardiya C Card */}
              <div className="bg-[#0070ba] text-white p-4 rounded-2xl shadow-md text-center opacity-95">
                <div className="text-base sm:text-xl font-bold">
                  VARDİYA: C
                </div>
                <div className="text-sm sm:text-base font-semibold mt-1 font-mono">
                  Toplam Üretim: 379.921 KG
                </div>
              </div>
            </div>

            {/* Bottom Azure Banner with Slogan matching Photo 7 */}
            <div className="bg-[#0099e6] text-white text-center py-3 -mb-6 -mx-6 sm:-mb-10 sm:-mx-10 rounded-b-lg">
              <span className="text-xl sm:text-3xl font-black tracking-wider uppercase font-sans">
                {slogan || 'Başarı ekip işidir.'}
              </span>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Vitrin Wrapper Container */}
      <div
        ref={containerRef}
        className={`${
          isFullscreen
            ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col'
            : 'bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col'
        }`}
      >
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Fabrika TV Vitrin Panosu
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full animate-pulse">
                  {intervalSeconds} SN DÖNGÜ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Slayt {currentSlideIndex + 1} / {slides.length}: {currentSlide.title}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick 1s - 5s buttons (1 sn sürekli default) */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 px-1 hidden sm:inline flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Süre:</span>
              </span>
              {[1, 2, 3, 4, 5].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setIntervalSeconds(sec);
                    setProgress(0);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    intervalSeconds === sec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={`${sec} Saniye`}
                >
                  {sec} sn {sec === 1 ? '(Sürekli)' : ''}
                </button>
              ))}
            </div>

            {/* Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
              title={isPlaying ? 'Döngüyü Duraklat' : 'Döngüyü Oynat'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Prev / Next */}
            <button
              onClick={goToPrev}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
              title="Önceki Slayt"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
              title="Sonraki Slayt"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* User Requested: Bilgileri Düzenleme Butonu */}
            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
              title="Panodaki Konik renklerini, Vortex makinelerini ve verileri güncelle"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Bilgileri Güncelle</span>
            </button>

            {/* User Requested: Tam Ekran TV Modu */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              title="Tam Ekran TV Kiosk Modu (Fabrika Gösterimi)"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Küçült (ESC)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tam Ekran TV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 20 Second Progress Countdown Bar */}
        <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all duration-100 ${
              isPlaying ? 'bg-blue-600' : 'bg-slate-400'
            }`}
          />
        </div>

        {/* Slide Display Area (Clicking opens fullscreen as requested: "o bilgilere basılınca tam ekran olsun") */}
        <div
          onClick={() => {
            if (!isFullscreen) setIsFullscreen(true);
          }}
          className={`flex-1 relative flex items-center justify-center cursor-pointer group ${
            isFullscreen ? 'h-full p-4 sm:p-8 bg-slate-950' : 'min-h-[500px] p-4 bg-slate-100'
          }`}
          title="Tam ekrana geçmek için tıklayın"
        >
          {/* Main Slide Card */}
          <div
            className={`w-full max-w-6xl aspect-[16/9] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative flex flex-col transition-all ${
              !isFullscreen ? 'group-hover:shadow-xl' : 'shadow-2xl'
            }`}
          >
            {renderSlideContent()}

            {/* Click to fullscreen overlay indicator on hover (desktop) */}
            {!isFullscreen && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs pointer-events-none">
                <Maximize2 className="w-3 h-3" />
                <span>Tam Ekran için Tıkla</span>
              </div>
            )}
          </div>
        </div>

        {/* Slide Selector Indicator Dots */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setProgress(0);
              }}
              className={`h-2 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Slide Editor Modal */}
      <SlideEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        productLines={productLines}
        setProductLines={setProductLines}
        vortexMachines={vortexMachines}
        setVortexMachines={setVortexMachines}
        stationProductions={stationProductions}
        setStationProductions={setStationProductions}
        slogan={slogan}
        setSlogan={setSlogan}
        slides={slides}
        setSlides={setSlides}
      />
    </>
  );
};
