import React, { useState } from 'react';
import {
  ProductLineRule,
  StationProductionRow,
  VortexMachineRule,
  ShowcaseSlide
} from '../types';
import {
  X,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  Palette,
  Layers,
  Factory
} from 'lucide-react';
import {
  INITIAL_PRODUCT_LINES,
  INITIAL_VORTEX_MACHINES,
  INITIAL_STATION_PRODUCTION
} from '../data/initialData';

interface SlideEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productLines: ProductLineRule[];
  setProductLines: (lines: ProductLineRule[]) => void;
  vortexMachines: VortexMachineRule[];
  setVortexMachines: (machines: VortexMachineRule[]) => void;
  stationProductions: StationProductionRow[];
  setStationProductions: (rows: StationProductionRow[]) => void;
  slogan: string;
  setSlogan: (slogan: string) => void;
  slides: ShowcaseSlide[];
  setSlides: (slides: ShowcaseSlide[]) => void;
}

export const SlideEditorModal: React.FC<SlideEditorModalProps> = ({
  isOpen,
  onClose,
  productLines,
  setProductLines,
  vortexMachines,
  setVortexMachines,
  stationProductions,
  setStationProductions,
  slogan,
  setSlogan,
}) => {
  const [activeTab, setActiveTab] = useState<'product_lines' | 'vortex' | 'stations' | 'slogan'>('vortex');

  // Local draft states
  const [draftProductLines, setDraftProductLines] = useState<ProductLineRule[]>(productLines);
  const [draftVortex, setDraftVortex] = useState<VortexMachineRule[]>(vortexMachines);
  const [draftStations, setDraftStations] = useState<StationProductionRow[]>(stationProductions);
  const [draftSlogan, setDraftSlogan] = useState<string>(slogan);

  if (!isOpen) return null;

  const handleSave = () => {
    setProductLines(draftProductLines);
    setVortexMachines(draftVortex);
    setStationProductions(draftStations);
    setSlogan(draftSlogan);
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Tüm vitrin verilerini orijinal fabrika ayarlarına sıfırlamak istiyor musunuz?')) {
      setDraftProductLines(INITIAL_PRODUCT_LINES);
      setDraftVortex(INITIAL_VORTEX_MACHINES);
      setDraftStations(INITIAL_STATION_PRODUCTION);
      setDraftSlogan('Başarı ekip işidir.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dijital Vitrin ve Fabrika Bilgi Panolarını Düzenle
              </h2>
              <p className="text-xs text-slate-500">
                Örnek panolardaki renk kodları, Vortex makine eşleştirmeleri ve istasyon verilerini güncelleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vortex')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'vortex'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Vortex Makineleri (1 - 20)
          </button>
          <button
            onClick={() => setActiveTab('product_lines')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'product_lines'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Ürün Hatları & Çuval Renkleri
          </button>
          <button
            onClick={() => setActiveTab('stations')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'stations'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            İstasyon Üretim Rakamları
          </button>
          <button
            onClick={() => setActiveTab('slogan')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'slogan'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Slogan & Başlık
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: VORTEX MAKİNELERİ */}
          {activeTab === 'vortex' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span>
                  Her Vortex makinesi için çekilen iplik türü, konik rengi ve bandaj rengini belirleyin.
                </span>
                <span className="font-semibold text-blue-700">Toplam: {draftVortex.length} Makine</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto p-1">
                {draftVortex.map((m, idx) => (
                  <div
                    key={m.vortexNo}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Vortex No: {m.vortexNo}</span>
                      <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Hat #{m.vortexNo}
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">Ürün Cinsi</label>
                      <input
                        type="text"
                        value={m.product}
                        onChange={(e) => {
                          const updated = [...draftVortex];
                          updated[idx].product = e.target.value;
                          setDraftVortex(updated);
                        }}
                        className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">Konik Rengi</label>
                        <input
                          type="text"
                          value={m.conicalColor}
                          onChange={(e) => {
                            const updated = [...draftVortex];
                            updated[idx].conicalColor = e.target.value;
                            setDraftVortex(updated);
                          }}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">Bandaj Rengi</label>
                        <input
                          type="text"
                          value={m.bandageColor}
                          onChange={(e) => {
                            const updated = [...draftVortex];
                            updated[idx].bandageColor = e.target.value;
                            setDraftVortex(updated);
                          }}
                          className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ÜRÜN HATLARI & ÇUVAL RENKLERİ */}
          {activeTab === 'product_lines' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Fabrikadaki hatlar, bant kuşak renkleri, şerit telefi çuval renkleri ve üstübü çuval renk eşleşmelerini güncelleyin (Fotoğraf #2 referansı).
              </p>

              {draftProductLines.map((line, idx) => (
                <div key={line.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Hat #{idx + 1}: {line.line}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                      {line.beltColor}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Çalıştığı Hat Adı</label>
                      <input
                        type="text"
                        value={line.line}
                        onChange={(e) => {
                          const updated = [...draftProductLines];
                          updated[idx].line = e.target.value;
                          setDraftProductLines(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Kuşak Rengi</label>
                      <input
                        type="text"
                        value={line.beltColor}
                        onChange={(e) => {
                          const updated = [...draftProductLines];
                          updated[idx].beltColor = e.target.value;
                          setDraftProductLines(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Şerit Telefi Çuvalı</label>
                      <input
                        type="text"
                        value={line.sliverBagColor}
                        onChange={(e) => {
                          const updated = [...draftProductLines];
                          updated[idx].sliverBagColor = e.target.value;
                          setDraftProductLines(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Üstübü Çuval Rengi</label>
                      <input
                        type="text"
                        value={line.wasteBagColor}
                        onChange={(e) => {
                          const updated = [...draftProductLines];
                          updated[idx].wasteBagColor = e.target.value;
                          setDraftProductLines(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Meydan Çuval Rengi</label>
                      <input
                        type="text"
                        value={line.floorBagColor}
                        onChange={(e) => {
                          const updated = [...draftProductLines];
                          updated[idx].floorBagColor = e.target.value;
                          setDraftProductLines(updated);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: İSTASYON ÜRETİM MATRİSİ */}
          {activeTab === 'stations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Fotoğraf #6'daki Tarak, 1-3. Pasaj Cer, Vortex ve Paketleme istasyonlarının vardiya bazlı üretim KG değerlerini güncelleyin.
              </p>

              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {draftStations.map((row, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                      <span>Vardiya {row.shift} - {row.category}</span>
                      <span className="font-mono text-blue-700">Toplam: {row.toplam.toLocaleString('tr-TR')} KG</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">TARAK</label>
                        <input
                          type="number"
                          value={row.tarak}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].tarak = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">1.PASAJ CER</label>
                        <input
                          type="number"
                          value={row.cer1}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].cer1 = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">2.PASAJ CER</label>
                        <input
                          type="number"
                          value={row.cer2}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].cer2 = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">3.PASAJ CER</label>
                        <input
                          type="number"
                          value={row.cer3}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].cer3 = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">VORTEX</label>
                        <input
                          type="number"
                          value={row.vortex}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].vortex = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">PAKETLEME</label>
                        <input
                          type="number"
                          value={row.paketleme}
                          onChange={(e) => {
                            const updated = [...draftStations];
                            updated[idx].paketleme = Number(e.target.value);
                            setDraftStations(updated);
                          }}
                          className="w-full p-1.5 bg-white border rounded font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SLOGAN & METİNLER */}
          {activeTab === 'slogan' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Şampiyonluk ve Vitrin Alt Sloganı (Fotoğraf #7 Referansı)
                </label>
                <input
                  type="text"
                  value={draftSlogan}
                  onChange={(e) => setDraftSlogan(e.target.value)}
                  className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Başarı ekip işidir."
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Bilgi Panosu Notu:</span>
                Bu slogan şampiyonluk ekranının alt bandında ve dijital vitrinin 6. slaytında büyük puntolarla parlayacaktır.
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fabrika Varsayılanlarına Sıfırla</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
