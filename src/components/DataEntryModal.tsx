import React, { useState, useEffect } from 'react';
import { ProductionRecord, ShiftCode } from '../types';
import { X, Save, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { SHIFTS } from '../data/initialData';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecord: (record: ProductionRecord) => void;
  editingRecord?: ProductionRecord | null;
  defaultDate?: string;
  defaultShift?: ShiftCode;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  onSaveRecord,
  editingRecord,
  defaultDate,
  defaultShift,
}) => {
  const [date, setDate] = useState('2026-07-15');
  const [shift, setShift] = useState<ShiftCode>('A');
  const [yarnType, setYarnType] = useState('28/1 %50 PAMUK %50 PES');
  const [station, setStation] = useState('VORTEX');
  const [quantityKg, setQuantityKg] = useState<number>(15200);
  const [wasteKg, setWasteKg] = useState<number>(220);
  const [operator, setOperator] = useState('Ahmet Yılmaz');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingRecord) {
      setDate(editingRecord.date);
      setShift(editingRecord.shift);
      setYarnType(editingRecord.yarnType);
      setStation(editingRecord.station || 'VORTEX');
      setQuantityKg(editingRecord.quantityKg);
      setWasteKg(editingRecord.wasteKg);
      setOperator(editingRecord.operator);
      setNotes(editingRecord.notes || '');
    } else {
      if (defaultDate) setDate(defaultDate);
      if (defaultShift) setShift(defaultShift);
    }
  }, [editingRecord, defaultDate, defaultShift, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError('Lütfen bir üretim tarihi seçiniz.');
      return;
    }
    if (quantityKg <= 0) {
      setError('Üretilen miktar 0 KG üzerinde olmalıdır.');
      return;
    }
    if (!operator.trim()) {
      setError('Operatör / Vardiya amiri adı zorunludur.');
      return;
    }

    const dayNumber = parseInt(date.split('-')[2], 10) || 1;

    const newRecord: ProductionRecord = {
      id: editingRecord ? editingRecord.id : `rec-${Date.now()}`,
      date,
      dayNumber,
      shift,
      yarnType,
      station,
      quantityKg: Number(quantityKg),
      wasteKg: Number(wasteKg) || 0,
      operator: operator.trim(),
      notes: notes.trim(),
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
    };

    onSaveRecord(newRecord);
    setError(null);
    onClose();
  };

  const commonYarnTypes = [
    '28/1 %50 PAMUK %50 PES',
    '28/1 %100 VİSKON',
    '30/1 KARIŞIM PENYE',
    '20/1 RING MELANJ',
    '36/1 %100 VİSKON KOMPAKT',
    '24/1 PAMUK POLYESTER KARIŞIM'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingRecord ? 'Vardiya Kaydını Düzenle' : 'Tekli Üretim Veri Girişi'}
              </h2>
              <p className="text-xs text-slate-500">
                Tarih, vardiya, iplik cinsi ve operatör detaylarını girin
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Tarih ve Vardiya Seçimi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Üretim Tarihi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Vardiya Seçimi
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftCode)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-medium"
              >
                <option value="A">1. Vardiya (08:00 - 16:00)</option>
                <option value="B">2. Vardiya (16:00 - 00:00)</option>
                <option value="C">3. Vardiya (00:00 - 08:00)</option>
              </select>
            </div>
          </div>

          {/* İplik Cinsi */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                İplik Cinsi / Tipi
              </label>
              <span className="text-[10px] text-slate-400">Örn: 28/1 %50 Pamuk</span>
            </div>
            <input
              type="text"
              list="yarn-options"
              value={yarnType}
              onChange={(e) => setYarnType(e.target.value)}
              placeholder="İplik cinsini seçin veya yazın..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              required
            />
            <datalist id="yarn-options">
              {commonYarnTypes.map((y) => (
                <option key={y} value={y} />
              ))}
            </datalist>
          </div>

          {/* İstasyon */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              İstasyon / Makine Grubu
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              <option value="VORTEX">VORTEX (Eğirme / İplik)</option>
              <option value="TARAK">TARAK</option>
              <option value="1.PASAJ CER">1. PASAJ CER</option>
              <option value="2.PASAJ CER">2. PASAJ CER</option>
              <option value="3.PASAJ CER">3. PASAJ CER</option>
              <option value="PAKETLEME">PAKETLEME / SEVKİYAT</option>
            </select>
          </div>

          {/* Üretilen Miktar & Fire Miktarı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Üretilen Miktar (KG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none pr-8"
                  required
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  KG
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fire Miktarı (KG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-rose-600 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none pr-8"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-rose-400">
                  KG
                </span>
              </div>
            </div>
          </div>

          {/* Operatör / Vardiya Amiri */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operatör / Vardiya Amiri Adı
            </label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              required
            />
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vardiya Notları / Açıklama (Opsiyonel)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Vortex 4 nolu makinede kopuşsuz devam edildi"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingRecord ? 'Değişiklikleri Kaydet' : 'Üretimi Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
