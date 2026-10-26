import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_CONFIG, NameplateConfig } from './types/nameplate';
import { ControlPanel } from './components/ControlPanel';
import { NameplatePreview } from './components/NameplatePreview';
import { checkFontLoaded } from './utils/fontCheck';

export function App() {
  const [config, setConfig] = useState<NameplateConfig>(DEFAULT_CONFIG);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    checkFontLoaded('UTM HelvetIns').then(setFontLoaded);
  }, []);

  // Cập nhật quy tắc @page động theo khổ giấy, hướng giấy và lề người dùng chọn
  useEffect(() => {
    const styleId = 'dynamic-print-page-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const sizeRule =
      config.paperSize === 'A4'
        ? `A4 ${config.orientation}`
        : `${config.customPaperWidthMm}mm ${config.customPaperHeightMm}mm`;

    styleEl.innerHTML = `
      @media print {
        @page {
          size: ${sizeRule};
          margin: ${config.pageMarginMm}mm;
        }
      }
    `;
  }, [
    config.paperSize,
    config.orientation,
    config.customPaperWidthMm,
    config.customPaperHeightMm,
    config.pageMarginMm,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSvg = () => {
    // Lấy đúng các mặt biển trong khu vực in: 1 mặt, hoặc 2 mặt (mặt sau đã lật) khi bật gấp đôi
    const printFaces = Array.from(
      document.querySelectorAll<SVGSVGElement>('.print-only .plate-svg')
    );
    const faces =
      printFaces.length > 0 ? printFaces : svgRef.current ? [svgRef.current] : [];
    if (faces.length === 0) return;

    const plateW = config.plateWidthCm;
    const plateH = config.plateHeightCm;
    const round = (value: number) => Math.round(value * 1000) / 1000;

    const isFolded = faces.length > 1 && config.foldMode !== 'none';
    const gapCm = isFolded
      ? Math.max(0, config.foldGapMm) / 10
      : faces.length > 1
        ? 0.8
        : 0;
    const totalH = faces.length * plateH + (faces.length - 1) * gapCm;

    const serializer = new XMLSerializer();
    const facesMarkup = faces
      .map((face, index) => {
        // Chỉ lấy phần nội dung (đã gồm phép lật của mặt sau), đặt đúng vị trí dọc
        const content = Array.from(face.childNodes)
          .map((node) => serializer.serializeToString(node))
          .join('');
        const offsetY = round(index * (plateH + gapCm));
        return `<g transform="translate(0 ${offsetY})">${content}</g>`;
      })
      .join('\n');

    const creaseY = round(plateH + gapCm / 2);
    const creaseMarkup =
      isFolded && config.foldShowLine
        ? `<line x1="0" y1="${creaseY}" x2="${plateW}" y2="${creaseY}" stroke="#64748b" stroke-width="0.02" stroke-dasharray="0.2 0.2" />`
        : '';

    const source = [
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${plateW}cm" height="${round(totalH)}cm" viewBox="0 0 ${plateW} ${round(totalH)}">`,
      facesMarkup,
      creaseMarkup,
      '</svg>',
    ].join('\n');

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = config.fullName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_À-ỹ]/g, '');
    const foldSuffix = isFolded ? '-2mat-gap-doi' : faces.length > 1 ? '-2ban' : '';
    link.href = url;
    link.download = `bien-ten-${safeName || 'mac-dinh'}-${config.plateWidthCm}x${config.plateHeightCm}cm${foldSuffix}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Giao diện làm việc trên màn hình (ẩn khi in) */}
      <div className="app-container no-print">
        <header className="app-header">
          <div>
            <h1>Ứng Dụng Tạo & In Biển Tên Để Bàn</h1>
            <p>
              Thiết kế theo kích thước vật lý thực tế ({config.plateWidthCm}cm ×{' '}
              {config.plateHeightCm}cm) • Chạy cục bộ 100% trên trình duyệt
            </p>
          </div>
        </header>

        <main className="main-workspace">
          <div className="left-column">
            <ControlPanel
              config={config}
              onChange={setConfig}
              onReset={() => setConfig(DEFAULT_CONFIG)}
              onPrint={handlePrint}
              onDownloadSvg={handleDownloadSvg}
              fontLoaded={fontLoaded}
            />
          </div>

          <div className="right-column">
            <div className="sticky-preview-card">
              <h2>Xem trước thành phẩm</h2>
              <NameplatePreview
                config={config}
                fontLoaded={fontLoaded}
                svgRef={svgRef}
                isPrintMode={false}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Khu vực chỉ hiển thị khi gọi lệnh In (giữ nguyên kích thước vật lý cm) */}
      <div className="print-only">
        <NameplatePreview
          config={config}
          fontLoaded={fontLoaded}
          isPrintMode={true}
        />
      </div>
    </>
  );
}

export default App;
