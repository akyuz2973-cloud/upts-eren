import React, { useState, useRef } from 'react';
import { ProductionRecord, ShiftCode } from '../types';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  ClipboardPaste,
  HelpCircle
} from 'lucide-react';
import { downloadTemplateCSV } from '../utils/export';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkImport: (records: ProductionRecord[], replaceAll: boolean) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onBulkImport,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [parsedRecords, setParsedRecords] = useState<ProductionRecord[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [replaceAll, setReplaceAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const parseCsvText = (text: string) => {
    try {
      const lines = text.trim().split(/\r\n|\n|\r/);
      if (lines.length < 2) {
        setParseError('Yüklenen dosya veya metin boş veya en az bir veri satırı içermiyor.');
        return;
      }

      // Check header or delimiter (semicolon, comma, tab)
      const firstLine = lines[0];
      const delimiter = firstLine.includes(';') ? ';' : firstLine.includes('\t') ? '\t' : ',';

      const results: ProductionRecord[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(delimiter).map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 4) {
          // Format expected: Tarih; Vardiya; İplik Cinsi; İstasyon; Miktar; Fire; Operatör; Notlar
          const date = parts[0] || '2026-07-01';
          const shiftRaw = (parts[1] || 'A').toUpperCase();
          const shift: ShiftCode = shiftRaw.includes('B') || shiftRaw === '2' ? 'B' : shiftRaw.includes('C') || shiftRaw === '3' ? 'C' : 'A';
          const yarnType = parts[2] || '28/1 %50 PAMUK %50 PES';
          const station = parts[3] || 'VORTEX';
          const quantityKg = parseFloat(parts[4]) || 12000;
          const wasteKg = parseFloat(parts[5]) || 180;
          const operator = parts[6] || 'Vardiya Ekibi';
          const notes = parts[7] || '';

          const dayNumber = parseInt(date.split('-')[2], 10) || 1;

          results.push({
            id: `bulk-${Date.now()}-${i}`,
            date,
            dayNumber,
            shift,
            yarnType,
            station,
            quantityKg,
            wasteKg,
            operator,
            notes,
            createdAt: new Date().toISOString(),
          });
        }
      }

      if (results.length === 0) {
        setParseError('Veriler ayrıştırılamadı. Lütfen örnek şablon formatına uygun CSV veya tablo kullanınız.');
      } else {
        setParsedRecords(results);
        setParseError(null);
      }
    } catch (err: unknown) {
      setParseError('Ayrıştırma hatası: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        parseCsvText(content);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        parseCsvText(content);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const handleApplyPaste = () => {
    if (pasteContent.trim()) {
      parseCsvText(pasteContent);
    }
  };

  const handleCommit = () => {
    if (parsedRecords.length > 0) {
      onBulkImport(parsedRecords, replaceAll);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Toplu / Günlük Veri Yükleme Alanı
              </h2>
              <p className="text-xs text-slate-500">
                Excel veya CSV dosyanızı yükleyin veya panodan yapıştırın
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Action Row: Template Download */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>
                Verilerinizi sisteme hatasız aktarmak için hazır Excel/CSV şablonunu kullanabilirsiniz.
              </span>
            </div>
            <button
              onClick={downloadTemplateCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Örnek Şablon İndir (.csv)</span>
            </button>
          </div>

          {/* Method 1: Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-blue-600 bg-blue-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Excel / CSV Dosyasını Buraya Sürükleyin
            </p>
            <p className="text-xs text-slate-500 mt-1">
              veya bilgisayarınızdan seçmek için tıklayın (.csv, .txt)
            </p>
          </div>

          {/* Method 2: Panodan Kopyala-Yapıştır */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ClipboardPaste className="w-3.5 h-3.5 text-slate-500" />
                <span>Veya Excel'den Kopyalanan Hücreleri Direkt Yapıştırın</span>
              </label>
              {pasteContent && (
                <button
                  onClick={handleApplyPaste}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Metni Ayrıştır ve Önizle
                </button>
              )}
            </div>
            <textarea
              rows={3}
              placeholder="Tarih;Vardiya;İplik Cinsi;İstasyon;Miktar;Fire;Operatör
2026-07-01;A;28/1 %50 PAMUK;VORTEX;15400;210;Ahmet Yılmaz"
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Preview of Parsed Records */}
          {parsedRecords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{parsedRecords.length} Adet Vardiya Kaydı Başarıyla Okundu</span>
                </span>
                <span className="text-slate-500">
                  Toplam KG: {parsedRecords.reduce((s, r) => s + r.quantityKg, 0).toLocaleString('tr-TR')}
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0">
                    <tr>
                      <th className="py-2 px-2.5">Tarih</th>
                      <th className="py-2 px-2.5">Vardiya</th>
                      <th className="py-2 px-2.5">İplik</th>
                      <th className="py-2 px-2.5 text-right">KG</th>
                      <th className="py-2 px-2.5 text-right">Fire</th>
                      <th className="py-2 px-2.5">Operatör</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {parsedRecords.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2.5">{r.date}</td>
                        <td className="py-1.5 px-2.5 font-bold">Vardiya {r.shift}</td>
                        <td className="py-1.5 px-2.5 font-sans">{r.yarnType}</td>
                        <td className="py-1.5 px-2.5 text-right font-bold">{r.quantityKg.toLocaleString('tr-TR')}</td>
                        <td className="py-1.5 px-2.5 text-right text-rose-600">{r.wasteKg}</td>
                        <td className="py-1.5 px-2.5 font-sans">{r.operator}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRecords.length > 10 && (
                <p className="text-[11px] text-slate-500 text-center">
                  ...ve {parsedRecords.length - 10} kayıt daha
                </p>
              )}

              {/* Import Options */}
              <div className="pt-2 flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceAll}
                    onChange={(e) => setReplaceAll(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mevcut kayıtların üzerine yaz (Tüm ayı temizleyip bu veriyi yükle)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            İptal
          </button>

          <button
            type="button"
            disabled={parsedRecords.length === 0}
            onClick={handleCommit}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{parsedRecords.length} Kaydı Sisteme Aktar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
