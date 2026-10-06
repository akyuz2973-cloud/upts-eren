import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  Play,
  Pause,
  Upload,
  Award,
  BarChart3,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ChevronRight,
  Volume2,
  VolumeX,
  Trash2,
  Film
} from 'lucide-react';
import { ShiftCode } from '../types';
import { saveVideoToStorage, deleteVideoFromStorage } from '../utils/videoStorage';
import { generateSampleCelebrationVideoBlob } from '../utils/sampleVideo';

interface ChampionSectionProps {
  monthLabel: string;
  leaderShift: ShiftCode;
  shiftTotals: {
    A: number;
    B: number;
    C: number;
  };
  shiftWastes: {
    A: number;
    B: number;
    C: number;
  };
  grandTotal: number;
  tourPhase?: 'announcement' | 'video';
  isFullscreenVideo?: boolean;
  setIsFullscreenVideo?: (full: boolean) => void;
  onVideoCompleted?: () => void;
  customVideoUrl: string | null;
  setCustomVideoUrl: (url: string | null) => void;
  videoMode: 'animation' | 'custom';
  setVideoMode: (mode: 'animation' | 'custom') => void;
  isAutoTourActive?: boolean;
}

export const ChampionSection: React.FC<ChampionSectionProps> = ({
  monthLabel,
  leaderShift,
  shiftTotals,
  shiftWastes,
  grandTotal,
  tourPhase = 'announcement',
  isFullscreenVideo = false,
  setIsFullscreenVideo,
  onVideoCompleted,
  customVideoUrl,
  setCustomVideoUrl,
  videoMode,
  setVideoMode,
  isAutoTourActive = true,
}) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement | null>(null);

  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
  const [animationRemainingSec, setAnimationRemainingSec] = useState<number>(10);
  const [uploadStatusMsg, setUploadStatusMsg] = useState<string | null>(null);

  const shiftNames: Record<ShiftCode, { name: string; hours: string; supervisor: string }> = {
    A: { name: '1. Vardiya', hours: '08:00 - 16:00', supervisor: 'Ahmet Yılmaz' },
    B: { name: '2. Vardiya', hours: '16:00 - 00:00', supervisor: 'Mehmet Demir' },
    C: { name: '3. Vardiya', hours: '00:00 - 08:00', supervisor: 'Hasan Kaya' },
  };

  const leaderData = shiftNames[leaderShift];
  const leaderKg = shiftTotals[leaderShift];
  const secondShift: ShiftCode = leaderShift === 'A' ? 'B' : 'A';
  const diffToSecond = leaderKg - shiftTotals[secondShift];

  // Trigger silent confetti burst
  const fireConfetti = () => {
    try {
      const end = Date.now() + 1.5 * 1000;
      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ffffff', '#fbbf24'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0.1, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 0.9, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fireConfetti();
    }, 600);
    return () => clearTimeout(timer);
  }, [leaderShift]);

  // Handle ESC key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenVideo && setIsFullscreenVideo) {
        setIsFullscreenVideo(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenVideo, setIsFullscreenVideo]);

  // FULLSCREEN VIDEO PLAYBACK LOGIC
  useEffect(() => {
    if (isFullscreenVideo && videoMode === 'custom' && customVideoUrl) {
      const vid = fullscreenVideoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.muted = false;
        setIsMuted(false);
        setAutoplayBlocked(false);

        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log('Unmuted autoplay blocked by browser policy, attempting muted fallback:', err);
            vid.muted = true;
            setIsMuted(true);
            setAutoplayBlocked(true);
            vid.play().catch(() => {});
          });
        }
      }
    }
  }, [isFullscreenVideo, videoMode, customVideoUrl]);

  // FULLSCREEN CELEBRATION ANIMATION TIMER (ONLY when animation mode is active)
  useEffect(() => {
    if (!isFullscreenVideo || videoMode !== 'animation') return;

    setAnimationRemainingSec(10);
    const interval = setInterval(() => {
      setAnimationRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (setIsFullscreenVideo) setIsFullscreenVideo(false);
          if (onVideoCompleted) onVideoCompleted();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFullscreenVideo, videoMode, onVideoCompleted, setIsFullscreenVideo]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = URL.createObjectURL(file);
        setCustomVideoUrl(url);
        setVideoMode('custom');
        await saveVideoToStorage(file, file.name);
        fireConfetti();
        setUploadStatusMsg(`"${file.name}" yüklendi ve kalıcı olarak kaydedildi.`);
        setTimeout(() => setUploadStatusMsg(null), 4000);
      } catch (err) {
        console.error('Error saving video to storage:', err);
      }
    }
  };

  const handleUseSampleVideo = async () => {
    try {
      setIsGeneratingSample(true);
      const blob = await generateSampleCelebrationVideoBlob(leaderShift, monthLabel);
      const url = URL.createObjectURL(blob);
      setCustomVideoUrl(url);
      setVideoMode('custom');
      await saveVideoToStorage(blob, 'ornek_kutlama_videosu.webm');
      fireConfetti();
      setUploadStatusMsg('Örnek şampiyonluk videosu hazırlandı ve kaydedildi.');
      setTimeout(() => setUploadStatusMsg(null), 4000);
    } catch (err) {
      console.error('Error creating sample video:', err);
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const handleRemoveVideo = async () => {
    try {
      await deleteVideoFromStorage();
      setCustomVideoUrl(null);
      setVideoMode('animation');
      setUploadStatusMsg('Özel video kaldırıldı, animasyon moduna geçildi.');
      setTimeout(() => setUploadStatusMsg(null), 3000);
    } catch (err) {
      console.error('Error removing video:', err);
    }
  };

  const handleFullscreenVideoEnded = () => {
    // Only fires when the fullscreen video finishes its full playback
    if (setIsFullscreenVideo) {
      setIsFullscreenVideo(false);
    }
    if (onVideoCompleted) {
      onVideoCompleted();
    }
  };

  const toggleSound = () => {
    const vid = fullscreenVideoRef.current;
    if (vid) {
      vid.muted = !vid.muted;
      setIsMuted(vid.muted);
      if (!vid.muted) setAutoplayBlocked(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Bar Chart calculations
  const maxShiftKg = Math.max(shiftTotals.A, shiftTotals.B, shiftTotals.C);
  const getBarHeight = (val: number) => {
    if (maxShiftKg === 0) return 10;
    return Math.max(15, Math.round((val / maxShiftKg) * 100));
  };

  return (
    <div className="space-y-6">
      {/* 1. ÜST ŞAMPİYON İLAN KARTI */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-700/50">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-amber-500 text-slate-950 rounded-md flex items-center gap-1 shadow-sm">
                <Trophy className="w-3.5 h-3.5 fill-slate-950" />
                <span>AYIN LİDERİ İLAN EDİLDİ</span>
              </span>
              <span className="text-xs text-blue-200">
                {monthLabel} Resmi Fabrika Rekoru
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>BU AYIN ŞAMPİYON VARDİYASI:</span>
              <span className="text-amber-400 underline decoration-amber-400/40">
                VARDİYA {leaderShift}
              </span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Tebrikler! <strong>{leaderData.name} ({leaderData.hours})</strong>, Vardiya Amiri <strong>{leaderData.supervisor}</strong> ve değerli ekibi, toplam <strong>{leaderKg.toLocaleString('tr-TR')} KG</strong> kaliteli iplik üreterek Temmuz ayının zirvesine yerleşmiştir.
            </p>
          </div>

          {/* Action celebration trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={fireConfetti}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Konfeti Patlat!</span>
            </button>
          </div>
        </div>

        {/* 3 Shift Snapshot Banners (Exact match with user's Image 7) */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-blue-200 mb-3">
            <span className="font-bold tracking-wide uppercase">
              {monthLabel.toUpperCase()} AYI VARDİYA SIRALAMASI
            </span>
            <span className="text-[11px] text-slate-400">[Şirkete Özel / Internal Only]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Vardiya A */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                leaderShift === 'A'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 ring-2 ring-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black flex items-center gap-1.5">
                  {leaderShift === 'A' && <Trophy className="w-4 h-4 fill-amber-300 text-amber-300" />}
                  VARDİYA: A
                </span>
                {leaderShift === 'A' && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    1. SIRADA
                  </span>
                )}
              </div>
              <div className="mt-2 text-xl font-extrabold font-mono tabular-nums">
                {shiftTotals.A.toLocaleString('tr-TR')} <span className="text-xs font-normal opacity-80">KG</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                Amir: Ahmet Yılmaz · Fire: {shiftWastes.A.toLocaleString('tr-TR')} KG
              </div>
            </div>

            {/* Vardiya B */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                leaderShift === 'B'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 ring-2 ring-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black flex items-center gap-1.5">
                  {leaderShift === 'B' && <Trophy className="w-4 h-4 fill-amber-300 text-amber-300" />}
                  VARDİYA: B
                </span>
                {leaderShift === 'B' && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    1. SIRADA
                  </span>
                )}
              </div>
              <div className="mt-2 text-xl font-extrabold font-mono tabular-nums">
                {shiftTotals.B.toLocaleString('tr-TR')} <span className="text-xs font-normal opacity-80">KG</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                Amir: Mehmet Demir · Fire: {shiftWastes.B.toLocaleString('tr-TR')} KG
              </div>
            </div>

            {/* Vardiya C */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                leaderShift === 'C'
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/50 ring-2 ring-amber-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black flex items-center gap-1.5">
                  {leaderShift === 'C' && <Trophy className="w-4 h-4 fill-amber-300 text-amber-300" />}
                  VARDİYA: C
                </span>
                {leaderShift === 'C' && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    1. SIRADA
                  </span>
                )}
              </div>
              <div className="mt-2 text-xl font-extrabold font-mono tabular-nums">
                {shiftTotals.C.toLocaleString('tr-TR')} <span className="text-xs font-normal opacity-80">KG</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                Amir: Hasan Kaya · Fire: {shiftWastes.C.toLocaleString('tr-TR')} KG
              </div>
            </div>
          </div>

          {/* High-Impact Slogan Banner from Image 7 */}
          <div className="mt-8 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 py-5 sm:py-7 px-6 bg-gradient-to-r from-[#0070ba] via-[#0099e6] to-[#0070ba] text-white text-center shadow-2xl border-t-4 border-white/40 rounded-b-2xl">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider uppercase drop-shadow-md text-white font-sans">
              "BAŞARI EKİP İŞİDİR."
            </h2>
          </div>
        </div>
      </div>

      {/* 2. KUTLAMA VİDEOSU / ANİMASYON OYNATICI & KIYASLAMA GRAFİĞİ */}
      <div id="champion-celebration-video" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-20">
        {/* Left: Video / Celebration Animation Player (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Status Toast Banner if video action occurred */}
          {uploadStatusMsg && (
            <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{uploadStatusMsg}</span>
              </span>
              <button onClick={() => setUploadStatusMsg(null)} className="text-white/80 hover:text-white font-bold">×</button>
            </div>
          )}

          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Tebrikler & Şampiyonluk Videosu
                  </h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    videoMode === 'custom' && customVideoUrl
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    {videoMode === 'custom' && customVideoUrl ? '🎬 Özel Video Hazır' : '✨ Kutlama Animasyonu'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Şampiyonluk ilanı sonrasında video tam ekran açılır ve tüm video bittikten sonra sonraki bölüme geçer
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <label className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Video Yükle</span>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/webm,video/ogg"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>

              <button
                onClick={handleUseSampleVideo}
                disabled={isGeneratingSample}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-md cursor-pointer transition-colors"
                title="Sistemde hazır örnek şampiyonluk videosu oluşturur"
              >
                <Film className="w-3.5 h-3.5 text-amber-600" />
                <span>{isGeneratingSample ? 'Hazırlanıyor...' : 'Örnek Video'}</span>
              </button>

              {videoMode === 'custom' && customVideoUrl && (
                <button
                  onClick={handleRemoveVideo}
                  className="p-1 text-xs text-rose-600 hover:bg-rose-50 rounded border border-rose-200 cursor-pointer"
                  title="Videoyu Kaldır ve Animasyona Dön"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setIsFullscreenVideo && setIsFullscreenVideo(true)}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md cursor-pointer transition-colors shadow-xs"
                title="Videoyu Tam Ekran Başlat"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Tam Ekran Başlat</span>
              </button>
            </div>
          </div>

          {/* Player viewport: Önizleme ekranı (Arka planda kendi kendine bitmez, turu erken sonlandırmaz) */}
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
            {videoMode === 'custom' && customVideoUrl ? (
              <div className="relative w-full h-full group">
                <video
                  key={`preview-${customVideoUrl}`}
                  src={customVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Overlay hover launch button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <button
                    onClick={() => setIsFullscreenVideo && setIsFullscreenVideo(true)}
                    className="pointer-events-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Videoyu Tam Ekran Başlat</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Custom High-Fidelity Celebration Animation */
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 overflow-hidden select-none">
                {/* Floating particle orbs */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/30 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>

                {/* Animated 3D Trophy Graphic */}
                <div className="relative z-10 mb-3 flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-2xl shadow-amber-500/40 animate-bounce duration-1000">
                    <div className="w-full h-full rounded-full bg-slate-900/90 flex items-center justify-center border-2 border-amber-300">
                      <Trophy className="w-12 h-12 sm:w-14 sm:h-14 fill-amber-400 text-amber-300" />
                    </div>
                  </div>
                </div>

                {/* Congratulations text */}
                <div className="relative z-10 space-y-1">
                  <div className="inline-block text-[11px] font-black tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-500/40 px-3 py-0.5 rounded-full">
                    {monthLabel.toUpperCase()} AYI 1.Sİ
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    TEBRİKLER VARDİYA {leaderShift}!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-mono">
                    {leaderKg.toLocaleString('tr-TR')} KG Üretim ile Fabrika Zirvesinde!
                  </p>
                </div>

                {/* Bottom ticker banner in animation */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Üstün Randıman & Minimum Fire</span>
                  </span>
                  <span className="text-amber-400 font-semibold font-mono">
                    +{diffToSecond.toLocaleString('tr-TR')} KG Fark
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Video bottom controls bar */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={fireConfetti}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Konfeti Patlat</span>
              </button>

              <button
                onClick={() => setIsFullscreenVideo && setIsFullscreenVideo(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Tam Ekran Oynat</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              {videoMode === 'custom' && customVideoUrl ? (
                <span className="text-emerald-700 font-semibold">
                  ✓ Kalıcı video yüklü (Turda tam ekran oynatılır)
                </span>
              ) : (
                <span>MP4 veya WebM formatında video yükleyebilirsiniz</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Vardiya Performans Kıyaslama Çubuk Grafiği (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Vardiya Performans Kıyaslama</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ay boyunca üretilen toplam kilogram bazında karşılaştırma
                </p>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Toplam: {grandTotal.toLocaleString('tr-TR')} KG
              </span>
            </div>

            {/* Vertical Bar Chart Graphic */}
            <div className="h-56 pt-6 pb-2 px-4 flex items-end justify-around gap-6 border-b border-slate-200 bg-slate-50/50 rounded-xl">
              {/* Shift A Bar */}
              <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <span className="text-xs font-mono font-bold text-amber-700 tabular-nums">
                  {shiftTotals.A.toLocaleString('tr-TR')}
                </span>
                <div
                  style={{ height: `${getBarHeight(shiftTotals.A)}%` }}
                  className={`w-full max-w-[64px] rounded-t-lg transition-all duration-700 relative group flex items-end justify-center ${
                    leaderShift === 'A'
                      ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-300'
                  }`}
                >
                  {leaderShift === 'A' && (
                    <div className="absolute -top-7">
                      <Trophy className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-slate-900 pb-1 font-mono">
                    %{((shiftTotals.A / (grandTotal || 1)) * 100).toFixed(0)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-slate-800 block">Vardiya A</span>
                  <span className="text-[10px] text-slate-400 font-sans">08:00 - 16:00</span>
                </div>
              </div>

              {/* Shift B Bar */}
              <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  {shiftTotals.B.toLocaleString('tr-TR')}
                </span>
                <div
                  style={{ height: `${getBarHeight(shiftTotals.B)}%` }}
                  className={`w-full max-w-[64px] rounded-t-lg transition-all duration-700 relative group flex items-end justify-center ${
                    leaderShift === 'B'
                      ? 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-blue-400'
                  }`}
                >
                  {leaderShift === 'B' && (
                    <div className="absolute -top-7">
                      <Trophy className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-white pb-1 font-mono">
                    %{((shiftTotals.B / (grandTotal || 1)) * 100).toFixed(0)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-slate-800 block">Vardiya B</span>
                  <span className="text-[10px] text-slate-400 font-sans">16:00 - 00:00</span>
                </div>
              </div>

              {/* Shift C Bar */}
              <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <span className="text-xs font-mono font-bold text-emerald-700 tabular-nums">
                  {shiftTotals.C.toLocaleString('tr-TR')}
                </span>
                <div
                  style={{ height: `${getBarHeight(shiftTotals.C)}%` }}
                  className={`w-full max-w-[64px] rounded-t-lg transition-all duration-700 relative group flex items-end justify-center ${
                    leaderShift === 'C'
                      ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'bg-emerald-400'
                  }`}
                >
                  {leaderShift === 'C' && (
                    <div className="absolute -top-7">
                      <Trophy className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-white pb-1 font-mono">
                    %{((shiftTotals.C / (grandTotal || 1)) * 100).toFixed(0)}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-slate-800 block">Vardiya C</span>
                  <span className="text-[10px] text-slate-400 font-sans">00:00 - 08:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="mt-4 pt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Liderlik Kilogram Farkı:</span>
              <strong className="text-amber-800 font-mono">+{diffToSecond.toLocaleString('tr-TR')} KG</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Şampiyon Vardiya Fire Miktarı:</span>
              <strong className="text-slate-800 font-mono">{shiftWastes[leaderShift].toLocaleString('tr-TR')} KG</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Fabrika İçi Pay:</span>
              <strong className="text-blue-700 font-mono">
                %{((leaderKg / (grandTotal || 1)) * 100).toFixed(1)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FULLSCREEN CELEBRATION THEATER MODAL (Tek ve Gerçek Oynatma Noktası) */}
      {isFullscreenVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-300">
          {/* Fullscreen Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shrink-0">
                <Trophy className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-amber-400">
                    Şampiyonluk Kutlama Videosu · Vardiya {leaderShift}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-slate-950 rounded-md">
                    TAM EKRAN
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {videoMode === 'custom' && customVideoUrl
                    ? 'Kutlama videosu sonuna kadar oynatılıyor. Video bittiğinde otomatik sonraki bölüme geçilir.'
                    : 'Kutlama animasyonu oynatılıyor.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio toggle button if unmuted autoplay was blocked */}
              {videoMode === 'custom' && customVideoUrl && (
                <button
                  onClick={toggleSound}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                    autoplayBlocked || isMuted
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-white/50 animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? 'Sesi Aç' : 'Ses Açık'}</span>
                </button>
              )}

              <button
                onClick={handleFullscreenVideoEnded}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                title="Videoyu beklemeden hemen sonraki bölüme geç"
              >
                <span>Sonrakine Geç (Vitrin)</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFullscreenVideo && setIsFullscreenVideo(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
                title="Tam Ekrandan Çık (ESC)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Video Viewport */}
          <div className="flex-1 w-full max-w-6xl mx-auto my-auto aspect-video max-h-[78vh] flex items-center justify-center relative overflow-hidden rounded-2xl shadow-2xl bg-black border border-white/10">
            {videoMode === 'custom' && customVideoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={fullscreenVideoRef}
                  key={`fullscreen-${customVideoUrl}`}
                  src={customVideoUrl}
                  controls
                  playsInline
                  onEnded={handleFullscreenVideoEnded}
                  onTimeUpdate={(e) => {
                    const target = e.currentTarget;
                    setVideoCurrentTime(target.currentTime);
                    if (target.duration) setVideoDuration(target.duration);
                  }}
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.duration) {
                      setVideoDuration(e.currentTarget.duration);
                    }
                  }}
                  className="w-full h-full object-contain"
                />

                {/* Autoplay blocked banner */}
                {autoplayBlocked && (
                  <div
                    onClick={toggleSound}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-amber-400 transition-transform hover:scale-105 z-30"
                  >
                    <VolumeX className="w-4 h-4 animate-bounce" />
                    <span>Tarayıcı sesi susturdu - 🔊 Sesi Açmak İçin Buraya Tıklayın</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 overflow-hidden select-none">
                {/* Floating particle orbs */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-amber-500/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                {/* Animated 3D Trophy Graphic */}
                <div className="relative z-10 mb-4 flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1.5 shadow-2xl shadow-amber-500/50 animate-bounce duration-1000">
                    <div className="w-full h-full rounded-full bg-slate-900/90 flex items-center justify-center border-2 border-amber-300">
                      <Trophy className="w-16 h-16 sm:w-20 sm:h-20 fill-amber-400 text-amber-300" />
                    </div>
                  </div>
                </div>

                {/* Congratulations text */}
                <div className="relative z-10 space-y-2">
                  <div className="inline-block text-xs font-black tracking-widest text-amber-400 uppercase bg-amber-950/80 border border-amber-500/50 px-4 py-1 rounded-full shadow-md">
                    {monthLabel.toUpperCase()} AYI 1.Sİ
                  </div>
                  <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    TEBRİKLER VARDİYA {leaderShift}!
                  </h3>
                  <p className="text-sm sm:text-lg text-slate-300 font-mono">
                    {leaderKg.toLocaleString('tr-TR')} KG Üretim ile Fabrika Zirvesinde!
                  </p>
                </div>

                {/* Bottom ticker banner in animation */}
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Üstün Randıman & Minimum Fire</span>
                  </span>
                  <span className="text-amber-400 font-bold font-mono text-sm">
                    +{diffToSecond.toLocaleString('tr-TR')} KG Fark
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Footer: Canlı İlerleme ve Süre Göstergesi */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-3 border-t border-white/10 z-20">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {videoMode === 'custom' && customVideoUrl
                    ? 'Kutlama Videosu Oynatılıyor... (Tüm video bittikten sonra sonraki bölüme geçilecek)'
                    : `Kutlama Animasyonu (${animationRemainingSec}s sonra sonraki bölüme geçilecek)`}
                </span>
              </span>

              {videoMode === 'custom' && videoDuration > 0 && (
                <span className="font-mono text-amber-400 bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold">
                  {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                </span>
              )}
            </div>

            <span className="text-slate-300 font-medium">
              Eren Tekstil · {monthLabel} Şampiyonu Vardiya {leaderShift} ({leaderKg.toLocaleString('tr-TR')} KG)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

