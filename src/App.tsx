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
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgRef.current);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = config.fullName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-_À-ỹ]/g, '');
    link.href = url;
    link.download = `bien-ten-${safeName || 'mac-dinh'}-${config.plateWidthCm}x${config.plateHeightCm}cm.svg`;
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
